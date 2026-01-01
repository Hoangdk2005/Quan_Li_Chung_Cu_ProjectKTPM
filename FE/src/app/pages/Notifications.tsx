import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, Modal, Form, Input, Select, message, Card, Row, Col, Popconfirm } from 'antd';
import { PlusOutlined, SendOutlined, SearchOutlined, ReloadOutlined, EditOutlined, DeleteOutlined, BellOutlined } from '@ant-design/icons';
import { api } from '../services/api';

interface NotificationItem {
  id: string;
  title: string;
  content: string;
  type: string;
  status: string;
  createdDate: string;
  targetType: string;
}

const Notifications: React.FC = () => {
  const [data, setData] = useState<NotificationItem[]>([]);
  const [filteredData, setFilteredData] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NotificationItem | null>(null);
  const [form] = Form.useForm();

  // Filters
  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState<string | undefined>(undefined);
  const [searchStatus, setSearchStatus] = useState<string | undefined>(undefined);

  // Hàm tải dữ liệu từ API
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      setData(res.data || []);
      setFilteredData(res.data || []);
    } catch (error) {
      message.error("Không thể tải danh sách thông báo");
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
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.content.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    if (searchType) {
      result = result.filter(item => item.type === searchType);
    }

    if (searchStatus) {
      result = result.filter(item => item.status === searchStatus);
    }
    
    setFilteredData(result);
  }, [searchText, searchType, searchStatus, data]);

  // Xử lý tạo/cập nhật thông báo
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingItem) {
        await api.put(`/notifications/${editingItem.id}`, values);
        message.success("Cập nhật thông báo thành công");
      } else {
        await api.post('/notifications', values);
        message.success("Tạo thông báo thành công");
      }
      setIsModalOpen(false);
      setEditingItem(null);
      form.resetFields();
      fetchData();
    } catch (e) { 
      message.error("Lỗi khi lưu thông báo");
    }
  };

  const handleEdit = (record: NotificationItem) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      message.success("Xóa thông báo thành công");
      fetchData();
    } catch (err) {
      message.error("Lỗi khi xóa");
    }
  };

  // Xử lý phát hành thông báo (Status: DRAFT -> PUBLISHED)
  const handlePublish = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/publish`);
      message.success("Đã phát hành thông báo");
      fetchData();
    } catch (error) {
      message.error("Lỗi khi phát hành thông báo");
    }
  };

  const handleReset = () => {
    setSearchText("");
    setSearchType(undefined);
    setSearchStatus(undefined);
  };

  const columns = [
    { 
      title: 'Tiêu đề', 
      dataIndex: 'title', 
      key: 'title',
      render: (text: string) => <b>{text}</b>,
      sorter: (a: NotificationItem, b: NotificationItem) => a.title.localeCompare(b.title)
    },
    { 
      title: 'Loại', 
      dataIndex: 'type', 
      key: 'type', 
      render: (t: string) => {
        const typeMap: Record<string, { color: string; text: string }> = {
          'INFO': { color: 'blue', text: 'Thông tin' },
          'GENERAL': { color: 'cyan', text: 'Thông báo chung' },
          'FEE': { color: 'gold', text: 'Thông báo phí' },
          'PAYMENT': { color: 'purple', text: 'Thanh toán' },
          'ALERT': { color: 'red', text: 'Cảnh báo' },
          'MAINTENANCE': { color: 'orange', text: 'Bảo trì' },
        };
        const config = typeMap[t] || { color: 'default', text: t };
        return <Tag color={config.color}>{config.text}</Tag>;
      } 
    },
    { title: 'Ngày tạo', dataIndex: 'createdDate', key: 'createdDate' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (s: string) => (
        <Tag color={s === 'PUBLISHED' ? 'green' : 'orange'}>
          {s === 'PUBLISHED' ? 'Đã đăng' : 'Nháp'}
        </Tag> 
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: NotificationItem) => (
        <Space>
          {record.status === 'DRAFT' && (
            <>
              <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>Sửa</Button>
              <Popconfirm
                title="Phát hành thông báo này?"
                onConfirm={() => handlePublish(record.id)}
                okText="Đăng"
                cancelText="Hủy"
              >
                <Button type="primary" size="small" icon={<SendOutlined />}>Đăng</Button>
              </Popconfirm>
              <Popconfirm
                title="Xác nhận xóa thông báo này?"
                onConfirm={() => handleDelete(record.id)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button icon={<DeleteOutlined />} size="small" danger>Xóa</Button>
              </Popconfirm>
            </>
          )}
          {record.status === 'PUBLISHED' && (
            <Tag color="green">Đã phát hành</Tag>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title={<span><BellOutlined style={{ marginRight: 8 }} />Quản lý Thông báo</span>}
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingItem(null); form.resetFields(); setIsModalOpen(true); }}>
          Tạo thông báo
        </Button>
      }
    >
      {/* Filter Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8} md={6}>
          <Input
            placeholder="Tìm theo tiêu đề / nội dung"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Select
            placeholder="Lọc theo loại"
            value={searchType}
            onChange={setSearchType}
            allowClear
            style={{ width: "100%" }}
            options={[
              { value: "INFO", label: "Thông tin" },
              { value: "GENERAL", label: "Thông báo chung" },
              { value: "FEE", label: "Thông báo phí" },
              { value: "PAYMENT", label: "Thanh toán" },
              { value: "ALERT", label: "Cảnh báo" },
              { value: "MAINTENANCE", label: "Bảo trì" },
            ]}
          />
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Select
            placeholder="Lọc theo trạng thái"
            value={searchStatus}
            onChange={setSearchStatus}
            allowClear
            style={{ width: "100%" }}
            options={[
              { value: "DRAFT", label: "Nháp" },
              { value: "PUBLISHED", label: "Đã đăng" },
            ]}
          />
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>Đặt lại</Button>
        </Col>
      </Row>

      <Table 
        dataSource={filteredData} 
        columns={columns} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10, showTotal: (total) => `Tổng ${total} thông báo` }} 
      />

      <Modal 
        title={editingItem ? "Chỉnh sửa thông báo" : "Tạo thông báo mới"} 
        open={isModalOpen} 
        onOk={handleSubmit} 
        onCancel={() => { setIsModalOpen(false); setEditingItem(null); form.resetFields(); }}
        okText={editingItem ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical" initialValues={{ type: 'INFO', targetType: 'ALL' }}>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
            <Input placeholder="Ví dụ: Thông báo đóng tiền điện..." />
          </Form.Item>
          
          <Form.Item name="type" label="Loại tin">
            <Select options={[
                { value: 'INFO', label: 'Thông tin' },
                { value: 'GENERAL', label: 'Thông báo chung' },
                { value: 'FEE', label: 'Thông báo phí' },
                { value: 'PAYMENT', label: 'Thanh toán' },
                { value: 'ALERT', label: 'Cảnh báo / Khẩn cấp' },
                { value: 'MAINTENANCE', label: 'Bảo trì' },
            ]} />
          </Form.Item>
          
          <Form.Item name="targetType" label="Gửi tới">
             <Select options={[
                { value: 'ALL', label: 'Toàn bộ cư dân' },
                { value: 'SPECIFIC', label: 'Hộ cụ thể (Tính năng đang phát triển)' }
             ]} />
          </Form.Item>
          
          <Form.Item name="content" label="Nội dung" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
            <Input.TextArea rows={6} placeholder="Nhập nội dung chi tiết..." />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Notifications;