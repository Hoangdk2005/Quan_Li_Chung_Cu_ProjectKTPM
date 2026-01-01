import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, message, Table, Card, Row, Col, Select, Tag, Space } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EditOutlined, HomeOutlined, EyeOutlined } from '@ant-design/icons';
import { api } from "../services/api"; 
import HouseholdForm from '../components/Household/HouseholdForm';
import { useNavigate } from 'react-router-dom'; 
import dayjs from 'dayjs';

interface Household {
  id: string;
  householdId: string;
  ownerName: string;
  address: string;
  phone?: string;
  moveInDate?: string;
  status?: string;
  apartmentId?: string;
}

const Households: React.FC = () => {
  const navigate = useNavigate();
  const [households, setHouseholds] = useState<Household[]>([]);
  const [filteredData, setFilteredData] = useState<Household[]>([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHousehold, setEditingHousehold] = useState<Household | null>(null);
  const [form] = Form.useForm();

  // Filters
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);

  const fetchHouseholds = async () => {
    setLoading(true);
    try {
      const res = await api.get("/households");

      const list = Array.isArray(res.data)
        ? res.data
        : res.data.content || [];

      setHouseholds(list);
      setFilteredData(list);
    } catch (err: any) {
      message.error(err.response?.data?.message || "Lỗi tải danh sách hộ dân");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHouseholds();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = [...households];

    if (searchText) {
      result = result.filter(item =>
        item.householdId.toLowerCase().includes(searchText.toLowerCase()) ||
        item.ownerName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.address.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filterStatus) {
      result = result.filter(item => item.status === filterStatus);
    }

    setFilteredData(result);
  }, [searchText, filterStatus, households]);

  const handleSubmit = async () => { 
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        moveInDate: values.moveInDate ? values.moveInDate.format('YYYY-MM-DD') : null,
      };
      if (editingHousehold) {
        await api.put(`/households/${editingHousehold.id}`, payload);
        message.success('Cập nhật hộ dân thành công!');
      } else {
        await api.post('/households', payload);
        message.success('Thêm hộ dân thành công!');
      }
      setIsModalOpen(false);
      setEditingHousehold(null);
      form.resetFields();
      fetchHouseholds();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Lỗi khi lưu hộ dân');
    }
  };

  const handleEdit = (household: Household) => {
    setEditingHousehold(household);
    setIsModalOpen(true);
    form.setFieldsValue({
      ...household,
      moveInDate: household.moveInDate ? dayjs(household.moveInDate) : null,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/households/${id}`);
      message.success('Xóa hộ dân thành công!');
      fetchHouseholds();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Lỗi khi xóa hộ dân');
    }
  };

  const handleReset = () => {
    setSearchText("");
    setFilterStatus(undefined);
  };

  const columns = [
    { 
      title: 'Mã hộ', 
      dataIndex: 'householdId',
      render: (text: string) => <b>{text}</b>,
      sorter: (a: Household, b: Household) => a.householdId.localeCompare(b.householdId)
    },
    { 
      title: 'Tên chủ hộ', 
      dataIndex: 'ownerName',
      sorter: (a: Household, b: Household) => a.ownerName.localeCompare(b.ownerName)
    },
    { title: 'Địa chỉ', dataIndex: 'address' },
    { title: 'Số điện thoại', dataIndex: 'phone' },
    { title: 'Ngày chuyển đến', dataIndex: 'moveInDate' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status',
      render: (s: string) => {
        let color = 'default';
        let text = s || 'Không xác định';
        if (s === 'ACTIVE') { color = 'green'; text = 'Đang ở'; }
        else if (s === 'INACTIVE') { color = 'orange'; text = 'Đã chuyển đi'; }
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Household) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" onClick={() => navigate(`/households/${record.id}`)}>
            Chi tiết
          </Button>
          <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
        </Space>
      ),
    },
  ];


  return (
    <Card 
      title={<span><HomeOutlined style={{ marginRight: 8 }} />Quản lý Hộ dân</span>}
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingHousehold(null);
            setIsModalOpen(true);
            form.resetFields();
          }}
        >
          Thêm hộ dân
        </Button>
      }
    >
      {/* Filter Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={8}>
          <Input
            placeholder="Tìm theo mã hộ / tên chủ hộ / địa chỉ"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Select
            placeholder="Lọc theo trạng thái"
            value={filterStatus}
            onChange={setFilterStatus}
            allowClear
            style={{ width: "100%" }}
            options={[
              { value: "ACTIVE", label: "Đang ở" },
              { value: "INACTIVE", label: "Đã chuyển đi" },
            ]}
          />
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>Đặt lại</Button>
        </Col>
      </Row>

      <Table 
        columns={columns} 
        dataSource={filteredData} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10, showTotal: (total) => `Tổng ${total} hộ dân` }}
      />

      <Modal
        title={editingHousehold ? 'Sửa hộ dân' : 'Thêm hộ dân'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingHousehold(null);
          form.resetFields();
        }}
        okText={editingHousehold ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
      >
        <HouseholdForm form={form} />
      </Modal>
    </Card>
  );
};

export default Households;

