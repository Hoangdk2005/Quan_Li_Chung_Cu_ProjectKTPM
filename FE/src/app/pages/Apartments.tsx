import React, { useEffect, useState } from "react";
import { Table, Card, Button, Modal, Form, Input, Select, InputNumber, message, Tag, Space, Popconfirm, Row, Col } from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import { api } from "../services/api";

interface Apartment {
  id: string;
  block: string;
  floor: string;
  unit: string;
  area: number;
  status: string;
}

const Apartments = () => {
  const [data, setData] = useState<Apartment[]>([]);
  const [filteredData, setFilteredData] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Apartment | null>(null);
  const [form] = Form.useForm();

  // Filters
  const [searchBlock, setSearchBlock] = useState("");
  const [searchStatus, setSearchStatus] = useState<string | undefined>(undefined);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/apartments");
      setData(res.data);
      setFilteredData(res.data);
    } catch (err) {
      message.error("Lỗi tải danh sách căn hộ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Filter logic
  useEffect(() => {
    let result = [...data];
    
    if (searchBlock) {
      result = result.filter(item => 
        item.block.toLowerCase().includes(searchBlock.toLowerCase()) ||
        item.unit.toLowerCase().includes(searchBlock.toLowerCase()) ||
        item.floor.toLowerCase().includes(searchBlock.toLowerCase())
      );
    }
    
    if (searchStatus) {
      result = result.filter(item => item.status === searchStatus);
    }
    
    setFilteredData(result);
  }, [searchBlock, searchStatus, data]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingItem) {
        await api.put(`/apartments/${editingItem.id}`, values);
        message.success("Cập nhật căn hộ thành công");
      } else {
        await api.post("/apartments", values);
        message.success("Thêm căn hộ thành công");
      }
      setIsModalOpen(false);
      setEditingItem(null);
      form.resetFields();
      fetchData();
    } catch (err) {
      message.error("Lỗi khi lưu");
    }
  };

  const handleEdit = (record: Apartment) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/apartments/${id}`);
      message.success("Xóa căn hộ thành công");
      fetchData();
    } catch (err) {
      message.error("Lỗi khi xóa");
    }
  };

  const handleReset = () => {
    setSearchBlock("");
    setSearchStatus(undefined);
  };

  const columns = [
    { title: "Block", dataIndex: "block", key: "block", sorter: (a: Apartment, b: Apartment) => a.block.localeCompare(b.block) },
    { title: "Tầng", dataIndex: "floor", key: "floor", sorter: (a: Apartment, b: Apartment) => a.floor.localeCompare(b.floor) },
    { title: "Căn số", dataIndex: "unit", key: "unit" },
    { title: "Diện tích (m²)", dataIndex: "area", key: "area", sorter: (a: Apartment, b: Apartment) => a.area - b.area },
    { 
      title: "Trạng thái", dataIndex: "status", 
      render: (status: string) => (
        <Tag color={status === "OCCUPIED" ? "green" : "orange"}>
          {status === "OCCUPIED" ? "Đã có người ở" : "Còn trống"}
        </Tag>
      )
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Apartment) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Xác nhận xóa căn hộ này?"
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
      title="Danh sách Căn hộ" 
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
            placeholder="Tìm theo Block/Tầng/Căn"
            prefix={<SearchOutlined />}
            value={searchBlock}
            onChange={(e) => setSearchBlock(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Select
            placeholder="Lọc theo trạng thái"
            value={searchStatus}
            onChange={setSearchStatus}
            allowClear
            style={{ width: "100%" }}
            options={[
              { value: "EMPTY", label: "Còn trống" },
              { value: "OCCUPIED", label: "Đã có người ở" },
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
        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} căn hộ` }}
      />
      
      <Modal 
        title={editingItem ? "Chỉnh sửa căn hộ" : "Thêm căn hộ mới"} 
        open={isModalOpen} 
        onOk={handleSubmit} 
        onCancel={() => { setIsModalOpen(false); setEditingItem(null); form.resetFields(); }}
        okText={editingItem ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="block" label="Block" rules={[{ required: true, message: "Vui lòng nhập Block" }]}>
            <Input placeholder="VD: A, B, C..." />
          </Form.Item>
          <Form.Item name="floor" label="Tầng" rules={[{ required: true, message: "Vui lòng nhập tầng" }]}>
            <Input placeholder="VD: 01, 02, 03..." />
          </Form.Item>
          <Form.Item name="unit" label="Mã căn" rules={[{ required: true, message: "Vui lòng nhập mã căn" }]}>
            <Input placeholder="VD: 05, 06..." />
          </Form.Item>
          <Form.Item name="area" label="Diện tích (m²)" rules={[{ required: true, message: "Vui lòng nhập diện tích" }]}>
            <InputNumber style={{ width: "100%" }} min={0} placeholder="VD: 75" />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" initialValue="EMPTY">
            <Select options={[
              { value: "EMPTY", label: "Còn trống" }, 
              { value: "OCCUPIED", label: "Đã có người ở" }
            ]} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Apartments;