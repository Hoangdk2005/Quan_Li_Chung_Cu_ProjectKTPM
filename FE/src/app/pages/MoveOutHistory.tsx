import React, { useEffect, useState } from 'react';
import { Table, Card, Tag, message, Button, Input, Select, Row, Col, Space, Popconfirm } from 'antd';
import { SearchOutlined, ReloadOutlined, EditOutlined, DeleteOutlined, HistoryOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { api } from '../services/api';

interface Resident {
  id: string;
  householdId: string;
  householdCode?: string;
  fullName: string;
  dob: string;
  gender: string;
  idNumber: string;
  relationshipToHead: string;
  status: string;
  phone?: string;
}

interface Household {
  id: string;
  householdId: string;
  ownerName: string;
}

const MoveOutHistory: React.FC = () => {
  const [data, setData] = useState<Resident[]>([]);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchText, setSearchText] = useState("");
  const [filterHousehold, setFilterHousehold] = useState<string | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchData();
    fetchHouseholds();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/residents');
      // Lọc chỉ lấy cư dân đã chuyển đi hoặc đã mất
      const movedOut = (res.data || []).filter(
        (r: Resident) => r.status === 'MOVED_OUT' || r.status === 'DECEASED'
      );
      setData(movedOut);
    } catch (error) {
      message.error('Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const fetchHouseholds = async () => {
    try {
      const res = await api.get('/households');
      const list = Array.isArray(res.data) ? res.data : res.data.content || [];
      setHouseholds(list);
    } catch (e) {}
  };

  // Filter logic
  const filteredData = React.useMemo(() => {
    let result = [...data];

    if (searchText) {
      result = result.filter(item =>
        item.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        (item.idNumber && item.idNumber.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    if (filterHousehold) {
      result = result.filter(item => String(item.householdId) === filterHousehold);
    }

    if (filterStatus) {
      result = result.filter(item => item.status === filterStatus);
    }

    return result;
  }, [searchText, filterHousehold, filterStatus, data]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/residents/${id}`);
      message.success('Xóa thành công');
      fetchData();
    } catch (e) {
      message.error('Lỗi khi xóa');
    }
  };

  const handleReset = () => {
    setSearchText("");
    setFilterHousehold(undefined);
    setFilterStatus(undefined);
  };

  const columns: ColumnsType<Resident> = [
    { 
      title: 'Họ và tên', 
      dataIndex: 'fullName', 
      key: 'fullName',
      render: (text) => <b>{text}</b>,
      sorter: (a, b) => a.fullName.localeCompare(b.fullName)
    },
    { title: 'Ngày sinh', dataIndex: 'dob', key: 'dob' },
    { 
      title: 'Giới tính', 
      dataIndex: 'gender', 
      key: 'gender',
      render: (g) => <Tag color={g === 'MALE' ? 'blue' : 'pink'}>{g === 'MALE' ? 'Nam' : 'Nữ'}</Tag>
    },
    { title: 'CMND/CCCD', dataIndex: 'idNumber', key: 'idNumber' },
    { title: 'Quan hệ chủ hộ', dataIndex: 'relationshipToHead', key: 'relationshipToHead' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => {
        const statusMap: Record<string, { color: string; label: string }> = {
          'MOVED_OUT': { color: 'red', label: 'Đã chuyển đi' },
          'DECEASED': { color: 'gray', label: 'Đã mất' },
        };
        const s = statusMap[status] || { color: 'default', label: status };
        return <Tag color={s.color}>{s.label}</Tag>;
      }
    },
    { 
      title: 'Mã Hộ (cũ)', 
      dataIndex: 'householdId', 
      key: 'householdId',
      render: (id) => {
        const hh = households.find(h => String(h.id) === String(id));
        return hh ? hh.householdId : id;
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Xác nhận xóa vĩnh viễn cư dân này?"
            description="Thông tin sẽ không thể khôi phục!"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} size="small" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Card 
      title={<span><HistoryOutlined style={{ marginRight: 8 }} />Lịch sử chuyển đi</span>}
    >
      {/* Filter Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Input
            placeholder="Tìm theo họ tên / CCCD"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Select
            placeholder="Lọc theo hộ cũ"
            value={filterHousehold}
            onChange={setFilterHousehold}
            allowClear
            style={{ width: "100%" }}
            showSearch
            optionFilterProp="children"
            options={households.map(h => ({ value: String(h.id), label: h.householdId + ' - ' + h.ownerName }))}
          />
        </Col>
        <Col xs={24} sm={8} md={3}>
          <Select
            placeholder="Trạng thái"
            value={filterStatus}
            onChange={setFilterStatus}
            allowClear
            style={{ width: "100%" }}
            options={[
              { value: "MOVED_OUT", label: "Đã chuyển đi" },
              { value: "DECEASED", label: "Đã mất" },
            ]}
          />
        </Col>
        <Col xs={24} sm={8} md={3}>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>Đặt lại</Button>
        </Col>
      </Row>

      <Table 
        columns={columns} 
        dataSource={filteredData} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10, showTotal: (total) => `Tổng ${total} cư dân` }}
        locale={{ emptyText: 'Chưa có cư dân nào chuyển đi hoặc đã mất' }}
      />
    </Card>
  );
};

export default MoveOutHistory;
