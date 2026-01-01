import React, { useEffect, useState } from "react";
import { Table, Card, Button, Modal, Form, Input, Select, InputNumber, message, Tag, Space, Popconfirm, Row, Col } from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, DollarOutlined } from "@ant-design/icons";
import { api } from "../services/api";

interface FeeItem {
  id: string;
  name: string;
  type: string;
  unit: string;
  cost: number;
  status: string;
}

const FeeItems = () => {
  const [items, setItems] = useState<FeeItem[]>([]);
  const [filteredData, setFilteredData] = useState<FeeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FeeItem | null>(null);
  const [form] = Form.useForm();

  // Filters
  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState<string | undefined>(undefined);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get("/fee-items");
      setItems(res.data);
      setFilteredData(res.data);
    } catch (err) {
      message.error("Lỗi tải danh sách khoản thu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  // Filter logic
  useEffect(() => {
    let result = [...items];
    
    if (searchText) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    if (searchType) {
      result = result.filter(item => item.type === searchType);
    }
    
    setFilteredData(result);
  }, [searchText, searchType, items]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingItem) {
        await api.put(`/fee-items/${editingItem.id}`, values);
        message.success("Cập nhật khoản thu thành công");
      } else {
        await api.post("/fee-items", values);
        message.success("Đã thêm khoản thu");
      }
      setIsModalOpen(false);
      setEditingItem(null);
      form.resetFields();
      fetchItems();
    } catch (err) {
      message.error("Lỗi khi lưu");
    }
  };

  const handleEdit = (record: FeeItem) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/fee-items/${id}`);
      message.success("Xóa khoản thu thành công");
      fetchItems();
    } catch (err) {
      message.error("Lỗi khi xóa");
    }
  };

  const handleReset = () => {
    setSearchText("");
    setSearchType(undefined);
  };

  const columns = [
    { 
      title: "Tên khoản thu", 
      dataIndex: "name",
      sorter: (a: FeeItem, b: FeeItem) => a.name.localeCompare(b.name)
    },
    { 
      title: "Loại", 
      dataIndex: "type",
      render: (type: string) => (
        <Tag color={type === 'SERVICE' ? 'blue' : 'green'}>
          {type === 'SERVICE' ? 'Dịch vụ' : 'Phương tiện'}
        </Tag>
      )
    },
    { 
      title: "Đơn vị tính", 
      dataIndex: "unit",
      render: (unit: string) => {
        const unitMap: Record<string, string> = {
          'M2': 'Theo m²',
          'SLOT': 'Theo chiếc',
          'FIXED': 'Cố định'
        };
        return unitMap[unit] || unit;
      }
    },
    { 
      title: "Đơn giá (VNĐ)", 
      dataIndex: "cost", 
      render: (val: number) => <b style={{ color: '#1890ff' }}>{val.toLocaleString()}</b>,
      sorter: (a: FeeItem, b: FeeItem) => a.cost - b.cost
    },
    { 
      title: "Trạng thái", 
      dataIndex: "status",
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
          {status === 'ACTIVE' ? 'Hoạt động' : 'Ngưng'}
        </Tag>
      )
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: FeeItem) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Xác nhận xóa khoản thu này?"
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
      title={<span><DollarOutlined style={{ marginRight: 8 }} />Danh mục Khoản thu</span>}
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingItem(null); form.resetFields(); setIsModalOpen(true); }}>
          Tạo mới
        </Button>
      }
    >
      {/* Filter Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8} md={6}>
          <Input
            placeholder="Tìm theo tên khoản thu"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Select
            placeholder="Lọc theo loại"
            value={searchType}
            onChange={setSearchType}
            allowClear
            style={{ width: "100%" }}
            options={[
              { value: "SERVICE", label: "Dịch vụ" },
              { value: "VEHICLE", label: "Phương tiện" },
            ]}
          />
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>Đặt lại</Button>
        </Col>
      </Row>

      <Table 
        rowKey="id" 
        dataSource={filteredData} 
        columns={columns} 
        loading={loading}
        pagination={{ pageSize: 10, showTotal: (total) => `Tổng ${total} khoản thu` }}
      />

      <Modal 
        title={editingItem ? "Chỉnh sửa khoản thu" : "Thêm khoản thu mới"} 
        open={isModalOpen} 
        onOk={handleSave} 
        onCancel={() => { setIsModalOpen(false); setEditingItem(null); form.resetFields(); }}
        okText={editingItem ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" initialValues={{ status: 'ACTIVE', type: 'SERVICE', unit: 'FIXED' }}>
          <Form.Item name="name" label="Tên khoản phí" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
            <Input placeholder="VD: Phí quản lý, Phí gửi xe..." />
          </Form.Item>
          <Form.Item name="type" label="Loại phí" rules={[{ required: true }]}>
            <Select options={[
              { value: 'SERVICE', label: 'Dịch vụ' }, 
              { value: 'VEHICLE', label: 'Phương tiện' }
            ]} />
          </Form.Item>
          <Form.Item name="unit" label="Đơn vị tính" rules={[{ required: true }]}>
            <Select options={[
              { value: 'M2', label: 'Theo m² (diện tích căn hộ)' }, 
              { value: 'SLOT', label: 'Theo chiếc (xe)' }, 
              { value: 'FIXED', label: 'Cố định/tháng' }
            ]} />
          </Form.Item>
          <Form.Item name="cost" label="Đơn giá (VNĐ)" rules={[{ required: true, message: "Vui lòng nhập đơn giá" }]}>
            <InputNumber 
              style={{ width: '100%' }} 
              min={0}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              placeholder="VD: 7000" 
            />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select options={[
              { value: 'ACTIVE', label: 'Hoạt động' }, 
              { value: 'INACTIVE', label: 'Ngưng' }
            ]} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default FeeItems;