// src/app/pages/resident/ResidentNotifications.tsx
import React, { useEffect, useState } from 'react';
import { Card, List, Tag, Typography, Empty, Spin, Input, Tabs, Badge, Avatar } from 'antd';
import {
  BellOutlined,
  DollarOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  SearchOutlined,
  CalendarOutlined,
  ToolOutlined,
  NotificationOutlined,
} from '@ant-design/icons';
import { api } from '../../services/api';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

interface NotificationItem {
  id: string;
  title: string;
  content: string;
  type: string; // INFO, ALERT, FEE
  status: string;
  createdDate: string;
  targetType: string;
}

const ResidentNotifications: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filteredData, setFilteredData] = useState<NotificationItem[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await api.get('/notifications');
        // Chỉ lấy thông báo đã publish
        const publishedNotifs = (res.data || []).filter(
          (n: NotificationItem) => n.status === 'PUBLISHED'
        );
        setNotifications(publishedNotifs);
        setFilteredData(publishedNotifs);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Lọc theo tab và search
  useEffect(() => {
    let filtered = notifications;

    // Lọc theo loại
    if (activeTab !== 'all') {
      filtered = filtered.filter(n => n.type === activeTab);
    }

    // Lọc theo search text
    if (searchText) {
      filtered = filtered.filter(
        n =>
          n.title.toLowerCase().includes(searchText.toLowerCase()) ||
          n.content.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [activeTab, searchText, notifications]);

  // Config cho từng loại thông báo
  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'FEE':
        return {
          icon: <DollarOutlined />,
          color: 'gold',
          label: 'Thông báo phí',
          bgColor: '#fffbe6',
          avatarBg: '#faad14',
        };
      case 'PAYMENT':
        return {
          icon: <DollarOutlined />,
          color: 'purple',
          label: 'Thanh toán',
          bgColor: '#f9f0ff',
          avatarBg: '#722ed1',
        };
      case 'ALERT':
        return {
          icon: <WarningOutlined />,
          color: 'red',
          label: 'Cảnh báo',
          bgColor: '#fff2f0',
          avatarBg: '#ff4d4f',
        };
      case 'MAINTENANCE':
        return {
          icon: <ToolOutlined />,
          color: 'orange',
          label: 'Bảo trì',
          bgColor: '#fff7e6',
          avatarBg: '#fa8c16',
        };
      case 'GENERAL':
        return {
          icon: <NotificationOutlined />,
          color: 'cyan',
          label: 'Thông báo chung',
          bgColor: '#e6fffb',
          avatarBg: '#13c2c2',
        };
      case 'INFO':
      default:
        return {
          icon: <InfoCircleOutlined />,
          color: 'blue',
          label: 'Thông tin',
          bgColor: '#e6f7ff',
          avatarBg: '#1890ff',
        };
    }
  };

  // Đếm số lượng theo loại
  const countByType = (type: string) => {
    if (type === 'all') return notifications.length;
    return notifications.filter(n => n.type === type).length;
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
        <BellOutlined style={{ marginRight: 8 }} />
        Thông báo
      </Title>

      {/* Thanh tìm kiếm */}
      <Card style={{ marginBottom: 16 }}>
        <Search
          placeholder="Tìm kiếm thông báo..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: 500 }}
        />
      </Card>

      {/* Tabs phân loại */}
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'all',
              label: (
                <span>
                  <BellOutlined /> Tất cả
                  <Badge count={countByType('all')} style={{ marginLeft: 8, backgroundColor: '#1890ff' }} />
                </span>
              ),
            },
            {
              key: 'GENERAL',
              label: (
                <span>
                  <NotificationOutlined /> Thông báo chung
                  <Badge count={countByType('GENERAL')} style={{ marginLeft: 8, backgroundColor: '#13c2c2' }} />
                </span>
              ),
            },
            {
              key: 'FEE',
              label: (
                <span>
                  <DollarOutlined /> Thông báo phí
                  <Badge count={countByType('FEE')} style={{ marginLeft: 8, backgroundColor: '#faad14' }} />
                </span>
              ),
            },
            {
              key: 'MAINTENANCE',
              label: (
                <span>
                  <ToolOutlined /> Bảo trì
                  <Badge count={countByType('MAINTENANCE')} style={{ marginLeft: 8, backgroundColor: '#fa8c16' }} />
                </span>
              ),
            },
            {
              key: 'ALERT',
              label: (
                <span>
                  <WarningOutlined /> Cảnh báo
                  <Badge count={countByType('ALERT')} style={{ marginLeft: 8, backgroundColor: '#ff4d4f' }} />
                </span>
              ),
            },
          ]}
        />

        {filteredData.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              searchText
                ? 'Không tìm thấy thông báo phù hợp'
                : 'Không có thông báo nào'
            }
          />
        ) : (
          <List
            itemLayout="vertical"
            dataSource={filteredData}
            pagination={{
              pageSize: 5,
              showSizeChanger: false,
            }}
            renderItem={(item) => {
              const config = getTypeConfig(item.type);
              return (
                <List.Item
                  key={item.id}
                  style={{
                    background: config.bgColor,
                    padding: 16,
                    marginBottom: 12,
                    borderRadius: 8,
                    border: '1px solid #f0f0f0',
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size={48}
                        style={{ backgroundColor: config.avatarBg }}
                        icon={config.icon}
                      />
                    }
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Text strong style={{ fontSize: 16 }}>{item.title}</Text>
                        <Tag color={config.color}>{config.label}</Tag>
                      </div>
                    }
                    description={
                      <div style={{ marginTop: 4 }}>
                        <CalendarOutlined style={{ marginRight: 6 }} />
                        <Text type="secondary">{item.createdDate}</Text>
                      </div>
                    }
                  />
                  <Paragraph
                    style={{ marginTop: 12, marginBottom: 0, marginLeft: 60 }}
                    ellipsis={{ rows: 3, expandable: true, symbol: 'Xem thêm' }}
                  >
                    {item.content}
                  </Paragraph>
                </List.Item>
              );
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default ResidentNotifications;
