import React, { useEffect, useState } from "react";
import { Table, Card, Tag, Input, Button, Modal, Form, Select, message, Row, Col, Statistic, InputNumber, Space } from "antd";
import { SearchOutlined, ReloadOutlined, DollarOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { api } from "../services/api";

interface Obligation {
  id: number;
  householdId: number;
  householdCode: string;
  ownerName: string;
  feeItemId: number;
  feeItemName: string;
  feePeriodId: number;
  periodYm: string;
  expectedAmount: number;
  paidAmount: number;
  dueDate: string;
  status: string;
  payerName: string;
  paidAt: string;
  paymentMethod: string;
  note: string;
}

const FeeObligations = () => {
  const [data, setData] = useState<Obligation[]>([]);
  const [filteredData, setFilteredData] = useState<Obligation[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State thu tiền
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedOb, setSelectedOb] = useState<Obligation | null>(null);
  const [payForm] = Form.useForm();

  // Filters
  const [searchText, setSearchText] = useState("");
  const [searchStatus, setSearchStatus] = useState<string | undefined>(undefined);
  const [searchPeriod, setSearchPeriod] = useState<string | undefined>(undefined);

  const fetchData = async () => {
    setLoading(true);
    try {
      const obRes = await api.get("/fee-obligations");
      setData(obRes.data);
      setFilteredData(obRes.data);
    } catch (err) {
      message.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Filter logic
  useEffect(() => {
    let result = [...data];
    
    if (searchText) {
      result = result.filter(item => {
        return (
          item.feeItemName.toLowerCase().includes(searchText.toLowerCase()) ||
          item.ownerName.toLowerCase().includes(searchText.toLowerCase()) ||
          item.householdCode.toLowerCase().includes(searchText.toLowerCase())
        );
      });
    }
    
    if (searchStatus) {
      result = result.filter(item => item.status === searchStatus);
    }

    if (searchPeriod) {
      result = result.filter(item => item.periodYm === searchPeriod);
    }
    
    setFilteredData(result);
  }, [searchText, searchStatus, searchPeriod, data]);

  const handlePay = async () => {
    try {
      const values = await payForm.validateFields();
      await api.patch(`/fee-obligations/${selectedOb?.id}/pay`, values);
      message.success("Đã thu tiền thành công!");
      setIsPayModalOpen(false);
      payForm.resetFields();
      fetchData();
    } catch (err) {
      message.error("Lỗi khi thu tiền");
    }
  };

  const handleReset = () => {
    setSearchText("");
    setSearchStatus(undefined);
    setSearchPeriod(undefined);
  };

  const getHouseholdInfo = (item: Obligation) => {
    return `${item.householdCode} - ${item.ownerName}`;
  };

  // Thống kê
  const totalExpected = data.reduce((sum, o) => sum + o.expectedAmount, 0);
  const totalPaid = data.reduce((sum, o) => sum + o.paidAmount, 0);
  const paidCount = data.filter(o => o.status === 'PAID').length;
  const unpaidCount = data.filter(o => o.status === 'UNPAID').length;

  // Lấy danh sách kỳ unique
  const uniquePeriods = [...new Set(data.map(o => o.periodYm))];

  const columns = [
    { 
      title: "Hộ dân", 
      key: "hh",
      render: (_: any, r: Obligation) => getHouseholdInfo(r),
      sorter: (a: Obligation, b: Obligation) => a.householdCode.localeCompare(b.householdCode)
    },
    { 
      title: "Khoản thu", 
      dataIndex: "feeItemName", 
      key: "item",
      sorter: (a: Obligation, b: Obligation) => a.feeItemName.localeCompare(b.feeItemName)
    },
    { title: "Kỳ", dataIndex: "periodYm", key: "period" },
    { 
      title: "Phải thu", 
      dataIndex: "expectedAmount", 
      render: (v: number) => <span style={{ color: '#1890ff', fontWeight: 500 }}>{v?.toLocaleString()}đ</span>,
      sorter: (a: Obligation, b: Obligation) => a.expectedAmount - b.expectedAmount
    },
    { 
      title: "Đã thu", 
      dataIndex: "paidAmount", 
      render: (v: number) => <span style={{ color: '#52c41a', fontWeight: 500 }}>{v?.toLocaleString()}đ</span> 
    },
    { 
      title: "Còn nợ", 
      key: "remaining",
      render: (_: any, r: Obligation) => {
        const remaining = r.expectedAmount - r.paidAmount;
        return <span style={{ color: remaining > 0 ? '#f5222d' : '#52c41a', fontWeight: 500 }}>{remaining.toLocaleString()}đ</span>;
      }
    },
    { 
      title: "Trạng thái", 
      dataIndex: "status",
      render: (s: string) => (
        <Tag icon={s === 'PAID' ? <CheckCircleOutlined /> : <ClockCircleOutlined />} color={s === 'PAID' ? 'success' : 'warning'}>
          {s === 'PAID' ? 'Đã thu' : 'Chưa thu'}
        </Tag>
      )
    },
    { title: "Hạn nộp", dataIndex: "dueDate", key: "dueDate" },
    {
      title: "Thao tác",
      render: (_: any, r: Obligation) => (
        r.status !== 'PAID' && 
        <Button type="primary" size="small" icon={<DollarOutlined />} onClick={() => {
          setSelectedOb(r);
          setIsPayModalOpen(true);
          payForm.setFieldsValue({ amount: r.expectedAmount - r.paidAmount, method: 'CASH' });
        }}>Thu tiền</Button>
      )
    }
  ];

  return (
    <Card title={<span><DollarOutlined style={{ marginRight: 8 }} />Danh sách Công nợ toàn tòa nhà</span>}>
      {/* Thống kê tổng quan */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic title="Tổng phải thu" value={totalExpected} suffix="đ" valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic title="Đã thu" value={totalPaid} suffix="đ" valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic title="Còn nợ" value={totalExpected - totalPaid} suffix="đ" valueStyle={{ color: '#f5222d' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic title="Tỷ lệ thu" value={totalExpected > 0 ? ((totalPaid / totalExpected) * 100).toFixed(1) : 0} suffix="%" valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
      </Row>

      {/* Filter Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8} md={6}>
          <Input
            placeholder="Tìm theo hộ dân / khoản thu"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Select
            placeholder="Lọc theo kỳ"
            value={searchPeriod}
            onChange={setSearchPeriod}
            allowClear
            style={{ width: "100%" }}
            options={uniquePeriods.map(p => ({ value: p, label: p }))}
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
              { value: "PAID", label: "Đã thu" },
              { value: "UNPAID", label: "Chưa thu" },
            ]}
          />
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>Đặt lại</Button>
            <Tag color="green">{paidCount} đã thu</Tag>
            <Tag color="orange">{unpaidCount} chưa thu</Tag>
          </Space>
        </Col>
      </Row>

      <Table 
        loading={loading} 
        rowKey="id" 
        dataSource={filteredData} 
        columns={columns}
        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} công nợ` }}
      />
      
      <Modal 
        title="Xác nhận thu tiền" 
        open={isPayModalOpen} 
        onOk={handlePay} 
        onCancel={() => { setIsPayModalOpen(false); payForm.resetFields(); }}
        okText="Xác nhận thu"
        cancelText="Hủy"
      >
        <Form form={payForm} layout="vertical">
          <Form.Item label="Khoản thu">
            <Input value={`${selectedOb?.feeItemName} - Kỳ ${selectedOb?.periodYm}`} disabled />
          </Form.Item>
          <Form.Item label="Hộ dân">
            <Input value={selectedOb ? getHouseholdInfo(selectedOb) : ''} disabled />
          </Form.Item>
          <Form.Item label="Số tiền phải thu">
            <Input value={`${((selectedOb?.expectedAmount || 0) - (selectedOb?.paidAmount || 0)).toLocaleString()}đ`} disabled />
          </Form.Item>
          <Form.Item name="paidAmount" label="Số tiền thực thu" rules={[{ required: true, message: "Vui lòng nhập số tiền" }]}>
            <InputNumber 
              style={{ width: '100%' }} 
              min={0}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              addonAfter="đ"
            />
          </Form.Item>
          <Form.Item name="paymentMethod" label="Hình thức thanh toán" rules={[{ required: true }]}>
            <Select options={[
              { value: 'CASH', label: 'Tiền mặt' }, 
              { value: 'BANK_TRANSFER', label: 'Chuyển khoản' }
            ]} />
          </Form.Item>
          <Form.Item name="payerName" label="Người nộp">
            <Input placeholder="Nhập tên người nộp" />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input placeholder="Ghi chú (nếu có)" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default FeeObligations;