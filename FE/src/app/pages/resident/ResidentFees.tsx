// src/app/pages/resident/ResidentFees.tsx
import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Tabs, Statistic, Row, Col, Typography, Empty, Spin, Badge, Tooltip, Divider, Avatar, List } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  WalletOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
  UserOutlined,
  CrownOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { api } from '../../services/api';

const { Title, Text } = Typography;

interface FeeObligation {
  id: number;
  feeItemName: string;
  periodYm: string;
  periodStatus: string; // OPEN, CLOSED
  expectedAmount: number;
  paidAmount: number;
  status: string;
  dueDate: string;
  householdId: number;
}

interface Resident {
  id: number;
  fullName: string;
  dob: string;
  gender: string;
  idNumber: string;
  relationshipToHead: string;
  phone: string;
  isHead: boolean;
  status: string;
}

interface HouseholdInfo {
  id: number;
  householdId: string;
  ownerName: string;
  phone: string;
  address: string;
  apartmentInfo?: string;
}

const ResidentFees: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [fees, setFees] = useState<FeeObligation[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [household, setHousehold] = useState<HouseholdInfo | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const householdId = localStorage.getItem('householdId') || '1';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy thông tin hộ gia đình
        const hhRes = await api.get(`/households/${householdId}`);
        setHousehold(hhRes.data);

        // Lấy danh sách thành viên trong gia đình
        const resRes = await api.get(`/households/${householdId}/residents`);
        setResidents(resRes.data || []);

        // Lấy các khoản phí của hộ gia đình
        const res = await api.get(`/households/${householdId}/fee-obligations`);
        setFees(res.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [householdId]);

  // Phân loại phí
  const unpaidFees = fees.filter(f => f.status === 'UNPAID');
  const paidFees = fees.filter(f => f.status === 'PAID');
  
  // Tính tổng
  const totalExpected = fees.reduce((sum, f) => sum + f.expectedAmount, 0);
  const totalPaid = fees.reduce((sum, f) => sum + f.paidAmount, 0);
  const totalUnpaid = totalExpected - totalPaid;

  // Kiểm tra quá hạn:
  // - Kỳ đã chốt sổ (CLOSED) + chưa đóng phí = QUÁ HẠN
  // - Kỳ đang hiện hành (OPEN) = hiển thị hạn nộp bình thường
  const isOverdue = (record: FeeObligation) => {
    return record.periodStatus === 'CLOSED' && record.status !== 'PAID';
  };

  const columns: ColumnsType<FeeObligation> = [
    {
      title: 'Khoản phí',
      dataIndex: 'feeItemName',
      key: 'feeItemName',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          {record.status === 'UNPAID' && isOverdue(record) && (
            <Tooltip title="Đã quá hạn thanh toán">
              <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginLeft: 8 }} />
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: 'Kỳ thu',
      dataIndex: 'periodYm',
      key: 'periodYm',
      render: (text) => (
        <span>
          <CalendarOutlined style={{ marginRight: 6 }} />
          {text}
        </span>
      ),
    },
    {
      title: 'Số tiền phải nộp',
      dataIndex: 'expectedAmount',
      key: 'expectedAmount',
      align: 'right',
      render: (value) => (
        <Text strong>{value?.toLocaleString()} đ</Text>
      ),
    },
    {
      title: 'Đã nộp',
      dataIndex: 'paidAmount',
      key: 'paidAmount',
      align: 'right',
      render: (value) => (
        <Text style={{ color: '#52c41a' }}>{value?.toLocaleString()} đ</Text>
      ),
    },
    {
      title: 'Còn nợ',
      key: 'remaining',
      align: 'right',
      render: (_, record) => {
        const remaining = record.expectedAmount - record.paidAmount;
        return (
          <Text style={{ color: remaining > 0 ? '#f5222d' : '#52c41a', fontWeight: 'bold' }}>
            {remaining?.toLocaleString()} đ
          </Text>
        );
      },
    },
    {
      title: 'Hạn nộp',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (text, record) => {
        const overdue = isOverdue(record);
        // Nếu đã nộp thì không cần hiện gì đặc biệt
        if (record.status === 'PAID') {
          return <Tag color="default">{text || '-'}</Tag>;
        }
        // Kỳ đã chốt sổ mà chưa nộp = quá hạn
        if (overdue) {
          return <Tag color="red">(Quá hạn)</Tag>;
        }
        // Kỳ đang hiện hành = hiển thị hạn nộp
        return <Tag color="blue">{text || 'Đang thu'}</Tag>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => (
        status === 'PAID' ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Đã nộp
          </Tag>
        ) : (
          <Tag icon={<ClockCircleOutlined />} color="warning">
            Chưa nộp
          </Tag>
        )
      ),
    },
  ];

  // Lọc dữ liệu theo tab
  const getFilteredData = () => {
    switch (activeTab) {
      case 'unpaid':
        return unpaidFees;
      case 'paid':
        return paidFees;
      default:
        return fees;
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        <WalletOutlined style={{ marginRight: 8 }} />
        Các khoản phí của hộ gia đình
      </Title>

      {/* Thông tin hộ gia đình và thành viên */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[24, 16]}>
          <Col xs={24} md={8}>
            <Card bordered={false} style={{ background: '#f6ffed', height: '100%' }}>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <HomeOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                <Title level={5} style={{ margin: '8px 0 0' }}>Thông tin căn hộ</Title>
              </div>
              <Divider style={{ margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text type="secondary">Mã hộ:</Text>
                <Text strong>{household?.householdId || '-'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text type="secondary">Chủ hộ:</Text>
                <Text strong>{household?.ownerName || '-'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text type="secondary">Địa chỉ:</Text>
                <Text strong>{household?.apartmentInfo || household?.address || '-'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Số thành viên:</Text>
                <Text strong>{residents.length} người</Text>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} md={16}>
            <Card 
              bordered={false} 
              style={{ background: '#e6f7ff', height: '100%' }}
              title={
                <span>
                  <TeamOutlined style={{ marginRight: 8 }} />
                  Thành viên trong gia đình ({residents.length} người)
                </span>
              }
            >
              <List
                grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }}
                dataSource={residents}
                renderItem={(item) => (
                  <List.Item>
                    <Card 
                      size="small" 
                      bordered
                      style={{ 
                        background: item.isHead ? '#fffbe6' : '#fff',
                        borderColor: item.isHead ? '#faad14' : '#d9d9d9'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          size={40} 
                          icon={item.isHead ? <CrownOutlined /> : <UserOutlined />}
                          style={{ 
                            backgroundColor: item.isHead ? '#faad14' : '#1890ff',
                            marginRight: 12
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Text strong>{item.fullName}</Text>
                            {item.isHead && <Tag color="gold" style={{ margin: 0 }}>Chủ hộ</Tag>}
                          </div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {item.relationshipToHead || 'Thành viên'}
                            {item.phone && ` • ${item.phone}`}
                          </Text>
                        </div>
                      </div>
                    </Card>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Thống kê tổng quan */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false}>
            <Statistic
              title="Tổng phải nộp"
              value={totalExpected}
              suffix="đ"
              valueStyle={{ color: '#1890ff' }}
              prefix={<WalletOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false}>
            <Statistic
              title="Đã thanh toán"
              value={totalPaid}
              suffix="đ"
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false}>
            <Statistic
              title="Còn nợ"
              value={totalUnpaid}
              suffix="đ"
              valueStyle={{ color: totalUnpaid > 0 ? '#f5222d' : '#52c41a' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Bảng chi tiết */}
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'all',
              label: (
                <span>
                  Tất cả
                  <Badge count={fees.length} style={{ marginLeft: 8, backgroundColor: '#1890ff' }} />
                </span>
              ),
            },
            {
              key: 'unpaid',
              label: (
                <span>
                  Chưa nộp
                  <Badge count={unpaidFees.length} style={{ marginLeft: 8, backgroundColor: '#faad14' }} />
                </span>
              ),
            },
            {
              key: 'paid',
              label: (
                <span>
                  Đã nộp
                  <Badge count={paidFees.length} style={{ marginLeft: 8, backgroundColor: '#52c41a' }} />
                </span>
              ),
            },
          ]}
        />

        {getFilteredData().length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              activeTab === 'unpaid'
                ? 'Không có khoản phí chưa nộp'
                : activeTab === 'paid'
                ? 'Chưa có khoản phí nào đã nộp'
                : 'Không có dữ liệu'
            }
          />
        ) : (
          <Table
            columns={columns}
            dataSource={getFilteredData()}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            rowClassName={(record) =>
              isOverdue(record) ? 'overdue-row' : ''
            }
          />
        )}
      </Card>

      {/* Ghi chú */}
      <Card style={{ marginTop: 16 }} size="small">
        <Title level={5}>Hướng dẫn thanh toán</Title>
        <ul style={{ paddingLeft: 20, marginBottom: 0 }}>
          <li>
            <Text>Thanh toán trực tiếp tại văn phòng Ban quản lý (Tầng 1, Tòa A)</Text>
          </li>
          <li>
            <Text>Chuyển khoản: <Text strong>Ngân hàng Vietcombank - STK: 1234567890 - CTK: BQL Chung cư BlueSky</Text></Text>
          </li>
          <li>
            <Text>Nội dung chuyển khoản: <Text code>[Mã căn hộ] - [Họ tên chủ hộ] - [Kỳ thanh toán]</Text></Text>
          </li>
        </ul>
      </Card>

      <style>{`
        .overdue-row {
          background-color: #fff2f0;
        }
        .overdue-row:hover > td {
          background-color: #ffccc7 !important;
        }
      `}</style>
    </div>
  );
};

export default ResidentFees;
