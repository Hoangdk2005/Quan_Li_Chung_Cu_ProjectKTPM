import React, { useEffect, useState } from 'react';
import { Table, Card, Tag, message, Button, Input, Select, Row, Col, Modal, Form, DatePicker, Space, Popconfirm, Checkbox } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { api } from '../services/api';
import dayjs from 'dayjs';

interface Resident {
  id: string;
  householdId: string;
  fullName: string;
  dob: string;
  gender: string;
  idNumber: string;
  relationshipToHead: string;
  status: string;
}

interface Household {
  id: string;
  householdId: string;
  ownerName: string;
}

const Residents: React.FC = () => {
  const [data, setData] = useState<Resident[]>([]);
  const [filteredData, setFilteredData] = useState<Resident[]>([]);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Resident | null>(null);
  const [form] = Form.useForm();

  // Filters
  const [searchText, setSearchText] = useState("");
  const [filterHousehold, setFilterHousehold] = useState<string | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [filterGender, setFilterGender] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchData();
    fetchHouseholds();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/residents');
      setData(res.data || []);
      setFilteredData(res.data || []);
    } catch (error) {
      message.error('Lỗi tải dữ liệu cư dân');
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
  useEffect(() => {
    let result = [...data];

    if (searchText) {
      result = result.filter(item =>
        item.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.idNumber.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filterHousehold) {
      result = result.filter(item => item.householdId === filterHousehold);
    }

    if (filterStatus) {
      result = result.filter(item => item.status === filterStatus);
    }

    if (filterGender) {
      result = result.filter(item => item.gender === filterGender);
    }

    setFilteredData(result);
  }, [searchText, filterHousehold, filterStatus, filterGender, data]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        householdId: Number(values.householdId),
        dob: values.dob ? values.dob.format('YYYY-MM-DD') : null,
      };
      if (editingItem) {
        await api.put(`/residents/${editingItem.id}`, payload);
        message.success('Cập nhật thành công');
      } else {
        await api.post('/residents', payload);
        message.success('Thêm cư dân thành công');
      }
      setIsModalOpen(false);
      setEditingItem(null);
      form.resetFields();
      fetchData();
    } catch (e) {
      message.error('Lỗi khi lưu');
    }
  };

  const handleEdit = (record: Resident) => {
    setEditingItem(record);
    form.setFieldsValue({
      ...record,
      householdId: String(record.householdId),
      dob: record.dob ? dayjs(record.dob) : null,
    });
    setIsModalOpen(true);
  };

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
    setFilterGender(undefined);
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
          'ACTIVE': { color: 'green', label: 'Đang ở' },
          'TAM_VANG': { color: 'orange', label: 'Tạm vắng' },
          'MOVED_OUT': { color: 'red', label: 'Đã chuyển đi' },
        };
        const s = statusMap[status] || { color: 'default', label: status };
        return <Tag color={s.color}>{s.label}</Tag>;
      }
    },
    { 
      title: 'Mã Hộ', 
      dataIndex: 'householdId', 
      key: 'householdId',
      render: (id) => {
        const hh = households.find(h => h.id === id);
        return hh ? hh.householdId : id;
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Xác nhận xóa cư dân này?"
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
      title={<span><UserOutlined style={{ marginRight: 8 }} />Danh sách Cư dân toàn khu</span>}
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingItem(null); form.resetFields(); setIsModalOpen(true); }}>
          Thêm cư dân
        </Button>
      }
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
            placeholder="Lọc theo hộ"
            value={filterHousehold}
            onChange={setFilterHousehold}
            allowClear
            style={{ width: "100%" }}
            showSearch
            optionFilterProp="children"
            options={households.map(h => ({ value: h.id, label: h.householdId + ' - ' + h.ownerName }))}
          />
        </Col>
        <Col xs={24} sm={8} md={3}>
          <Select
            placeholder="Giới tính"
            value={filterGender}
            onChange={setFilterGender}
            allowClear
            style={{ width: "100%" }}
            options={[
              { value: "MALE", label: "Nam" },
              { value: "FEMALE", label: "Nữ" },
            ]}
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
              { value: "ACTIVE", label: "Đang ở" },
              { value: "TAM_VANG", label: "Tạm vắng" },
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
      />

      <Modal
        title={editingItem ? "Chỉnh sửa cư dân" : "Thêm cư dân mới"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => { setIsModalOpen(false); setEditingItem(null); form.resetFields(); }}
        okText={editingItem ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical" initialValues={{ gender: 'MALE', status: 'ACTIVE' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
                <Input placeholder="Nguyễn Văn A" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="idNumber" label="CMND/CCCD" rules={[{ required: true, message: 'Vui lòng nhập số CCCD' }]}>
                <Input placeholder="001234567890" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="dob" label="Ngày sinh">
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="Chọn ngày sinh" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="gender" label="Giới tính">
                <Select options={[
                  { value: 'MALE', label: 'Nam' },
                  { value: 'FEMALE', label: 'Nữ' },
                ]} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="householdId" label="Thuộc hộ" rules={[{ required: true, message: 'Vui lòng chọn hộ' }]}>
                <Select
                  placeholder="Chọn hộ"
                  showSearch
                  optionFilterProp="children"
                  options={households.map(h => ({ value: h.id, label: h.householdId + ' - ' + h.ownerName }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="relationshipToHead" label="Quan hệ với chủ hộ">
                <Select options={[
                  { value: 'Chủ hộ', label: 'Chủ hộ' },
                  { value: 'Vợ/Chồng', label: 'Vợ/Chồng' },
                  { value: 'Con', label: 'Con' },
                  { value: 'Bố/Mẹ', label: 'Bố/Mẹ' },
                  { value: 'Anh/Chị/Em', label: 'Anh/Chị/Em' },
                  { value: 'Khác', label: 'Khác' },
                ]} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="isHead" valuePropName="checked">
                <Checkbox>Đặt làm chủ hộ</Checkbox>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Trạng thái">
                <Select options={[
                  { value: 'ACTIVE', label: 'Đang ở' },
                  { value: 'TAM_VANG', label: 'Tạm vắng' },
                  { value: 'MOVED_OUT', label: 'Đã chuyển đi' },
                ]} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Card>
  );
};

export default Residents;