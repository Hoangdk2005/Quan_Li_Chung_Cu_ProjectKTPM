import React, { useEffect, useState } from "react";
import { Table, Card, Button, Modal, Form, Input, DatePicker, message, Space, Popconfirm, Tag, Row, Col, Select } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, CalendarOutlined, PlayCircleOutlined, LockOutlined } from "@ant-design/icons";
import { api } from "../services/api";
import dayjs from 'dayjs';

interface FeePeriod {
  id: string;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
}

const FeePeriods = () => {
  const [periods, setPeriods] = useState<FeePeriod[]>([]);
  const [filteredData, setFilteredData] = useState<FeePeriod[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FeePeriod | null>(null);
  const [form] = Form.useForm();

  // Filters
  const [searchStatus, setSearchStatus] = useState<string | undefined>(undefined);

  const fetchPeriods = async () => {
    setLoading(true);
    try {
      const res = await api.get("/fee-periods");
      setPeriods(res.data);
      setFilteredData(res.data);
    } catch (err) {
      message.error("Lỗi tải danh sách kỳ thu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPeriods(); }, []);

  // Filter logic
  useEffect(() => {
    let result = [...periods];
    
    if (searchStatus) {
      result = result.filter(item => item.status === searchStatus);
    }
    
    setFilteredData(result);
  }, [searchStatus, periods]);

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
      };
      
      if (editingItem) {
        await api.put(`/fee-periods/${editingItem.id}`, payload);
        message.success("Cập nhật kỳ thu thành công");
      } else {
        await api.post("/fee-periods", payload);
        message.success("Tạo kỳ thu thành công");
      }
      setIsModalOpen(false);
      setEditingItem(null);
      form.resetFields();
      fetchPeriods();
    } catch (err) {
      message.error("Lỗi khi lưu");
    }
  };

  const handleEdit = (record: FeePeriod) => {
    setEditingItem(record);
    form.setFieldsValue({
      ...record,
      startDate: record.startDate ? dayjs(record.startDate) : null,
      endDate: record.endDate ? dayjs(record.endDate) : null,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/fee-periods/${id}`);
      message.success("Xóa kỳ thu thành công");
      fetchPeriods();
    } catch (err) {
      message.error("Lỗi khi xóa");
    }
  };

  const handleGenerate = async (id: string) => {
    try {
      await api.post(`/fee-periods/${id}/generate`);
      message.success("Đã tạo công nợ cho toàn bộ cư dân!");
      fetchPeriods(); // Reload to update status
    } catch (e) {
      message.error("Lỗi khi tạo công nợ");
    }
  };

  const handleClose = async (id: string) => {
    try {
      await api.patch(`/fee-periods/${id}/close`);
      message.success("Đã chốt sổ kỳ thu!");
      fetchPeriods();
    } catch (e) {
      message.error("Lỗi khi chốt sổ");
    }
  };

  const handleReset = () => {
    setSearchStatus(undefined);
  };

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      'DRAFT': { color: 'default', label: 'Nháp' },
      'OPEN': { color: 'processing', label: 'Đang tiến hành' },
      'CLOSED': { color: 'success', label: 'Đã chốt' },
    };
    const config = statusMap[status] || { color: 'default', label: status };
    return <Tag color={config.color}>{config.label}</Tag>;
  };

  const columns = [
    { 
      title: "Tên kỳ", 
      dataIndex: "name",
      sorter: (a: FeePeriod, b: FeePeriod) => a.name.localeCompare(b.name)
    },
    { title: "Ngày bắt đầu", dataIndex: "startDate" },
    { title: "Ngày kết thúc", dataIndex: "endDate" },
    { 
      title: "Trạng thái", 
      dataIndex: "status",
      render: (status: string) => getStatusTag(status)
    },
    {
      title: "Hành động",
      render: (_: any, record: FeePeriod) => (
        <Space>
          {record.status === 'DRAFT' && (
            <>
              <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>Sửa</Button>
              <Popconfirm
                title="Tạo công nợ cho tất cả hộ dân trong kỳ này?"
                onConfirm={() => handleGenerate(record.id)}
                okText="Tạo"
                cancelText="Hủy"
              >
                <Button type="primary" icon={<PlayCircleOutlined />} size="small">Tạo công nợ</Button>
              </Popconfirm>
              <Popconfirm
                title="Xác nhận xóa kỳ thu này?"
                onConfirm={() => handleDelete(record.id)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button icon={<DeleteOutlined />} size="small" danger>Xóa</Button>
              </Popconfirm>
            </>
          )}
          {record.status === 'OPEN' && (
            <Popconfirm
              title="Chốt sổ kỳ thu này? Sau khi chốt không thể sửa đổi."
              onConfirm={() => handleClose(record.id)}
              okText="Chốt sổ"
              cancelText="Hủy"
            >
              <Button icon={<LockOutlined />} size="small" danger>Chốt sổ</Button>
            </Popconfirm>
          )}
          {record.status === 'CLOSED' && (
            <Tag color="green">Đã hoàn thành</Tag>
          )}
        </Space>
      )
    }
  ];

  return (
    <Card 
      title={<span><CalendarOutlined style={{ marginRight: 8 }} />Quản lý Kỳ thu</span>}
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingItem(null); form.resetFields(); setIsModalOpen(true); }}>
          Kỳ mới
        </Button>
      }
    >
      {/* Filter Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8} md={6}>
          <Select
            placeholder="Lọc theo trạng thái"
            value={searchStatus}
            onChange={setSearchStatus}
            allowClear
            style={{ width: "100%" }}
            options={[
              { value: "DRAFT", label: "Nháp" },
              { value: "OPEN", label: "Đang tiến hành" },
              { value: "CLOSED", label: "Đã chốt" },
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
        pagination={{ pageSize: 10, showTotal: (total) => `Tổng ${total} kỳ thu` }}
      />

      <Modal 
        title={editingItem ? "Chỉnh sửa kỳ thu" : "Tạo kỳ thu mới"} 
        open={isModalOpen} 
        onOk={handleCreate} 
        onCancel={() => { setIsModalOpen(false); setEditingItem(null); form.resetFields(); }}
        okText={editingItem ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên kỳ (VD: 12/2023)" rules={[{ required: true, message: "Vui lòng nhập tên kỳ" }]}>
            <Input placeholder="VD: 12/2023, Q4/2023..." />
          </Form.Item>
          <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true, message: "Vui lòng chọn ngày" }]}>
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true, message: "Vui lòng chọn ngày" }]}>
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default FeePeriods;