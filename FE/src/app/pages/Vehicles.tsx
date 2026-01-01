import React, { useEffect, useState } from 'react';
import { Table, Card, Tag, message, Button, Modal, Form, Input, Select, Space, Popconfirm, Row, Col } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, CarOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { api } from '../services/api';

interface Vehicle {
  id: string;
  type: string;
  plate: string;
  brand: string;
  color: string;
  status: string;
  householdId: string;
}

interface Household {
  id: string;
  householdId: string;
  ownerName: string;
  address: string;
}

const Vehicles: React.FC = () => {
  const [data, setData] = useState<Vehicle[]>([]);
  const [filteredData, setFilteredData] = useState<Vehicle[]>([]);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Vehicle | null>(null);
  const [form] = Form.useForm();

  // Filters
  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState<string | undefined>(undefined);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vehiclesRes, householdsRes] = await Promise.all([
        api.get<Vehicle[]>('/vehicles'),
        api.get<Household[]>('/households')
      ]);
      setData(vehiclesRes.data || []);
      setFilteredData(vehiclesRes.data || []);
      setHouseholds(householdsRes.data || []);
    } catch (error) {
      message.error('Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Filter logic
  useEffect(() => {
    let result = [...data];
    
    if (searchText) {
      result = result.filter(item => 
        item.plate.toLowerCase().includes(searchText.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    if (searchType) {
      result = result.filter(item => item.type === searchType);
    }
    
    setFilteredData(result);
  }, [searchText, searchType, data]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingItem) {
        await api.put(`/vehicles/${editingItem.id}`, values);
        message.success("Cập nhật phương tiện thành công");
      } else {
        await api.post("/vehicles", values);
        message.success("Thêm phương tiện thành công");
      }
      setIsModalOpen(false);
      setEditingItem(null);
      form.resetFields();
      fetchData();
    } catch (err) {
      message.error("Lỗi khi lưu");
    }
  };

  const handleEdit = (record: Vehicle) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/vehicles/${id}`);
      message.success("Xóa phương tiện thành công");
      fetchData();
    } catch (err) {
      message.error("Lỗi khi xóa");
    }
  };

  const handleReset = () => {
    setSearchText("");
    setSearchType(undefined);
  };

  const getHouseholdInfo = (householdId: string) => {
    const hh = households.find(h => h.id === householdId);
    return hh ? `${hh.householdId} - ${hh.ownerName}` : householdId;
  };

  const columns: ColumnsType<Vehicle> = [
    { 
      title: 'Biển số', 
      dataIndex: 'plate', 
      key: 'plate', 
      render: (text) => <b>{text}</b>,
      sorter: (a, b) => a.plate.localeCompare(b.plate)
    },
    { 
      title: 'Loại xe', 
      dataIndex: 'type', 
      key: 'type',
      render: (type) => {
        const typeMap: Record<string, { label: string; color: string }> = {
          'Car': { label: 'Ô tô', color: 'blue' },
          'Motorbike': { label: 'Xe máy', color: 'green' },
          'Bicycle': { label: 'Xe đạp', color: 'orange' },
        };
        const config = typeMap[type] || { label: type, color: 'default' };
        return <Tag color={config.color}>{config.label}</Tag>;
      }
    },
    { title: 'Hãng xe', dataIndex: 'brand', key: 'brand' },
    { title: 'Màu sắc', dataIndex: 'color', key: 'color' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'green' : 'red'}>
          {status === 'Active' ? 'Đang sử dụng' : 'Ngừng sử dụng'}
        </Tag>
      )
    },
    { 
      title: 'Thuộc hộ', 
      dataIndex: 'householdId', 
      key: 'householdId',
      render: (id) => getHouseholdInfo(id)
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Xác nhận xóa phương tiện này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} size="small" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title={<span><CarOutlined style={{ marginRight: 8 }} />Quản lý Phương tiện</span>}
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingItem(null); form.resetFields(); setIsModalOpen(true); }}>
          Thêm mới
        </Button>
      }
    >
      {/* Filter Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8} md={6}>
          <Input
            placeholder="Tìm theo biển số / hãng xe"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Select
            placeholder="Lọc theo loại xe"
            value={searchType}
            onChange={setSearchType}
            allowClear
            style={{ width: "100%" }}
            options={[
              { value: "Car", label: "Ô tô" },
              { value: "Motorbike", label: "Xe máy" },
              { value: "Bicycle", label: "Xe đạp" },
            ]}
          />
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>Đặt lại</Button>
        </Col>
      </Row>

      <Table 
        columns={columns} 
        dataSource={filteredData} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} phương tiện` }}
      />

      <Modal 
        title={editingItem ? "Chỉnh sửa phương tiện" : "Thêm phương tiện mới"} 
        open={isModalOpen} 
        onOk={handleSubmit} 
        onCancel={() => { setIsModalOpen(false); setEditingItem(null); form.resetFields(); }}
        okText={editingItem ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" initialValues={{ status: 'Active', type: 'Motorbike' }}>
          <Form.Item name="type" label="Loại xe" rules={[{ required: true, message: "Vui lòng chọn loại xe" }]}>
            <Select options={[
              { value: "Car", label: "Ô tô" },
              { value: "Motorbike", label: "Xe máy" },
              { value: "Bicycle", label: "Xe đạp" },
            ]} />
          </Form.Item>
          <Form.Item name="plate" label="Biển số" rules={[{ required: true, message: "Vui lòng nhập biển số" }]}>
            <Input placeholder="VD: 29A-12345" />
          </Form.Item>
          <Form.Item name="brand" label="Hãng xe" rules={[{ required: true, message: "Vui lòng nhập hãng xe" }]}>
            <Input placeholder="VD: Honda, Toyota..." />
          </Form.Item>
          <Form.Item name="color" label="Màu sắc" rules={[{ required: true, message: "Vui lòng nhập màu sắc" }]}>
            <Input placeholder="VD: Đỏ, Trắng, Đen..." />
          </Form.Item>
          <Form.Item name="householdId" label="Thuộc hộ" rules={[{ required: true, message: "Vui lòng chọn hộ" }]}>
            <Select
              showSearch
              placeholder="Chọn hộ gia đình"
              optionFilterProp="children"
              options={households.map(h => ({ value: h.id, label: `${h.householdId} - ${h.ownerName} (${h.address})` }))}
            />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select options={[
              { value: "Active", label: "Đang sử dụng" },
              { value: "Inactive", label: "Ngừng sử dụng" },
            ]} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Vehicles;