// src/app/pages/resident/ResidentDashboard.tsx
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, List, Tag, Typography, Progress, Divider, Timeline, Spin, Space, Avatar, Table } from 'antd';
import {
  WalletOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  BellOutlined,
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  CrownOutlined,
} from '@ant-design/icons';
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
}

interface NotificationItem {
  id: string;
  title: string;
  content: string;
  type: string;
  createdDate: string;
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
  residentCount?: number;
  vehicleCount?: number;
}

const ResidentDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [fees, setFees] = useState<FeeObligation[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [household, setHousehold] = useState<HouseholdInfo | null>(null);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [residentCount, setResidentCount] = useState(0);

  // Lấy householdId từ localStorage
  const householdId = localStorage.getItem('householdId') || '1';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy thông tin hộ gia đình
        const hhRes = await api.get(`/households/${householdId}`);
        setHousehold(hhRes.data);

        // Lấy số thành viên
        const resRes = await api.get(`/households/${householdId}/residents`);
        const residentsList = resRes.data || [];
        setResidents(residentsList);
        setResidentCount(residentsList.length);

        // Lấy các khoản phí của hộ gia đình
        const feesRes = await api.get(`/households/${householdId}/fee-obligations`);
        setFees(feesRes.data || []);

        // Lấy thông báo đã publish
        const notifRes = await api.get('/notifications');
        const publishedNotifs = (notifRes.data || []).filter(
          (n: NotificationItem & { status: string }) => n.status === 'PUBLISHED'
        );
        setNotifications(publishedNotifs.slice(0, 5)); // Lấy 5 thông báo mới nhất
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [householdId]);

  // Lấy tên người dùng từ localStorage
  const fullName = localStorage.getItem('fullName') || 'Cư dân';

  // Tính toán thống kê
  const totalExpected = fees.reduce((sum, f) => sum + (f.expectedAmount || 0), 0);
  const totalPaid = fees.reduce((sum, f) => sum + (f.paidAmount || 0), 0);
  const unpaidFees = fees.filter(f => f.status === 'UNPAID');
  const paidFees = fees.filter(f => f.status === 'PAID');
  const paymentRate = totalExpected > 0 ? (totalPaid / totalExpected) * 100 : 0;

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
        <span role="img" aria-label="wave">👋</span> Xin chào, {fullName}
      </Title>

      {/* Thống kê tổng quan */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>Tổng phải nộp</span>}
              value={totalExpected}
              suffix="đ"
              valueStyle={{ color: '#fff', fontWeight: 'bold' }}
              prefix={<WalletOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>Đã thanh toán</span>}
              value={totalPaid}
              suffix="đ"
              valueStyle={{ color: '#fff', fontWeight: 'bold' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)' }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>Còn nợ</span>}
              value={totalExpected - totalPaid}
              suffix="đ"
              valueStyle={{ color: '#fff', fontWeight: 'bold' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>Khoản chưa nộp</span>}
              value={unpaidFees.length}
              suffix="khoản"
              valueStyle={{ color: '#fff', fontWeight: 'bold' }}
              prefix={<BellOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Các khoản phí chưa nộp */}
        <Col xs={24} lg={14}>
          <Card
            title={
              <span>
                <ClockCircleOutlined style={{ marginRight: 8, color: '#f5222d' }} />
                Các khoản phí chưa nộp
              </span>
            }
            extra={<a href="/resident/fees">Xem tất cả</a>}
          >
            {unpaidFees.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a' }} />
                <Title level={5} style={{ marginTop: 16, color: '#52c41a' }}>
                  Bạn đã thanh toán tất cả các khoản phí!
                </Title>
              </div>
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={unpaidFees}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Tag color="red" key="status">Chưa nộp</Tag>,
                      <Text strong key="amount" style={{ color: '#f5222d' }}>
                        {((item.expectedAmount || 0) - (item.paidAmount || 0)).toLocaleString()}đ
                      </Text>
                    ]}
                  >
                    <List.Item.Meta
                      title={<Text strong>{item.feeItemName}</Text>}
                      description={
                        <Space>
                          <CalendarOutlined />
                          <span>Kỳ: {item.periodYm}</span>
                          <Divider type="vertical" />
                          {item.periodStatus === 'CLOSED' ? (
                            <Tag color="red" style={{ margin: 0 }}>Quá hạn</Tag>
                          ) : (
                            <span>Hạn: {item.dueDate || 'Đang thu'}</span>
                          )}
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>

          {/* Tiến độ thanh toán */}
          <Card title="Tiến độ thanh toán" style={{ marginTop: 16 }}>
            <Progress
              percent={Math.round(paymentRate)}
              status={paymentRate >= 100 ? 'success' : 'active'}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Text type="secondary">Đã thanh toán: {paidFees.length} khoản</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text type="secondary">Chưa thanh toán: {unpaidFees.length} khoản</Text>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Thông báo mới */}
        <Col xs={24} lg={10}>
          <Card
            title={
              <span>
                <BellOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                Thông báo mới nhất
              </span>
            }
            extra={<a href="/resident/notifications">Xem tất cả</a>}
          >
            {notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <Text type="secondary">Không có thông báo mới</Text>
              </div>
            ) : (
              <Timeline
                items={notifications.map((notif) => ({
                  color: notif.type === 'ALERT' ? 'red' : notif.type === 'FEE' ? 'blue' : 'green',
                  children: (
                    <div>
                      <Text strong>{notif.title}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {notif.createdDate}
                      </Text>
                    </div>
                  ),
                }))}
              />
            )}
          </Card>

          {/* Thông tin căn hộ */}
          <Card title="Thông tin căn hộ" style={{ marginTop: 16 }}>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Text type="secondary">Mã hộ:</Text>
              </Col>
              <Col span={12}>
                <Text strong>{household?.householdId || '-'}</Text>
              </Col>
              <Col span={12}>
                <Text type="secondary">Căn hộ:</Text>
              </Col>
              <Col span={12}>
                <Text strong>{household?.apartmentInfo || household?.address || '-'}</Text>
              </Col>
              <Col span={12}>
                <Text type="secondary">Chủ hộ:</Text>
              </Col>
              <Col span={12}>
                <Text strong>{household?.ownerName || '-'}</Text>
              </Col>
              <Col span={12}>
                <Text type="secondary">Số thành viên:</Text>
              </Col>
              <Col span={12}>
                <Text strong>{residentCount} người</Text>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Danh sách thành viên trong gia đình */}
      <Card 
        title={
          <span>
            <TeamOutlined style={{ marginRight: 8, color: '#722ed1' }} />
            Thành viên trong gia đình ({residents.length} người)
          </span>
        }
        style={{ marginTop: 24 }}
      >
        <Table
          dataSource={residents}
          rowKey="id"
          pagination={false}
          columns={[
            {
              title: 'Thành viên',
              key: 'member',
              render: (_, record) => (
                <Space>
                  <Avatar 
                    icon={record.isHead ? <CrownOutlined /> : <UserOutlined />}
                    style={{ backgroundColor: record.isHead ? '#faad14' : '#1890ff' }}
                  />
                  <div>
                    <Text strong>{record.fullName}</Text>
                    {record.isHead && <Tag color="gold" style={{ marginLeft: 8 }}>Chủ hộ</Tag>}
                  </div>
                </Space>
              ),
            },
            {
              title: 'Quan hệ với chủ hộ',
              dataIndex: 'relationshipToHead',
              key: 'relationshipToHead',
              render: (text) => text || '-',
            },
            {
              title: 'Ngày sinh',
              dataIndex: 'dob',
              key: 'dob',
              render: (text) => text || '-',
            },
            {
              title: 'Giới tính',
              dataIndex: 'gender',
              key: 'gender',
              render: (text) => text === 'MALE' ? 'Nam' : text === 'FEMALE' ? 'Nữ' : text || '-',
            },
            {
              title: 'Số điện thoại',
              dataIndex: 'phone',
              key: 'phone',
              render: (text) => text || '-',
            },
            {
              title: 'Trạng thái',
              dataIndex: 'status',
              key: 'status',
              render: (status) => (
                <Tag color={status === 'ACTIVE' ? 'green' : status === 'TEMPORARY' ? 'blue' : 'default'}>
                  {status === 'ACTIVE' ? 'Đang cư trú' : status === 'TEMPORARY' ? 'Tạm trú' : status}
                </Tag>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default ResidentDashboard;
