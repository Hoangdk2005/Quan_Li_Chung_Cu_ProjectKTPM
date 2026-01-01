// src/app/layouts/ResidentLayout.tsx
import React, { useState } from 'react';
import { Layout, Menu, theme, Button, Avatar, Dropdown, Space, Breadcrumb, Badge, Popover, List, Typography } from 'antd';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  WalletOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return { key, icon, children, label } as MenuItem;
}

// Menu cho cư dân
const menuItems: MenuItem[] = [
  getItem('Trang chủ', '/resident/dashboard', <HomeOutlined />),
  getItem('Các khoản phí', '/resident/fees', <WalletOutlined />),
  getItem('Thông báo', '/resident/notifications', <BellOutlined />),
  getItem('Thông tin cá nhân', '/resident/profile', <UserOutlined />),
];

// Breadcrumb mapping
const breadcrumbNameMap: Record<string, string> = {
  '/resident/dashboard': 'Trang chủ',
  '/resident/fees': 'Các khoản phí',
  '/resident/notifications': 'Thông báo',
  '/resident/profile': 'Thông tin cá nhân',
};

const ResidentLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation();

  // Danh sách thông báo mẫu
  const notificationsList = [
    { title: 'Thông báo phí tháng 12', description: 'Vui lòng đóng phí quản lý trước ngày 31/12' },
    { title: 'Bảo trì thang máy', description: 'Thang máy B sẽ bảo trì vào ngày mai' },
  ];

  const notificationContent = (
    <div style={{ width: 300 }}>
      <List
        itemLayout="horizontal"
        dataSource={notificationsList}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={<span style={{ fontWeight: 600 }}>{item.title}</span>}
              description={<Text type="secondary" style={{ fontSize: 12 }}>{item.description}</Text>}
            />
          </List.Item>
        )}
      />
      <Button type="link" block onClick={() => navigate('/resident/notifications')}>
        Xem tất cả thông báo
      </Button>
    </div>
  );

  // Breadcrumb logic
  const pathSnippets = location.pathname.split('/').filter((i) => i);
  const breadcrumbItems = [
    { title: <Link to="/resident/dashboard">Trang chủ</Link>, key: 'home' },
    ...pathSnippets.slice(1).map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 2).join('/')}`;
      return {
        key: url,
        title: breadcrumbNameMap[url] || url,
      };
    }),
  ];

  // User dropdown menu
  const userMenuProps: MenuProps = {
    items: [
      {
        key: 'profile',
        label: 'Thông tin cá nhân',
        icon: <UserOutlined />,
        onClick: () => navigate('/resident/profile'),
      },
      {
        key: 'settings',
        label: 'Cài đặt',
        icon: <SettingOutlined />,
      },
      { type: 'divider' },
      {
        key: 'logout',
        label: 'Dang xuat',
        icon: <LogoutOutlined />,
        danger: true,
        onClick: () => {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('roles');
          localStorage.removeItem('userId');
          localStorage.removeItem('username');
          localStorage.removeItem('fullName');
          localStorage.removeItem('householdId');
          localStorage.removeItem('householdCode');
          navigate('/login');
        },
      },
    ],
  };

  const onMenuClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  const selectedKey = location.pathname;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={250}
        style={{
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 10,
          background: 'linear-gradient(180deg, #1890ff 0%, #096dd9 100%)',
        }}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{
            width: 36, height: 36, background: '#fff', borderRadius: 8, marginRight: collapsed ? 0 : 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <HomeOutlined style={{ fontSize: 20, color: '#1890ff' }} />
          </div>
          {!collapsed && (
            <span style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', whiteSpace: 'nowrap' }}>
              Cư dân BlueSky
            </span>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={onMenuClick}
          style={{ borderRight: 0, background: 'transparent' }}
        />
      </Sider>

      <Layout>
        <Header style={{
          padding: '0 24px',
          background: colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 64, height: 64, marginRight: 16 }}
            />
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <Space size={24}>
            <Popover
              content={notificationContent}
              title="Thông báo mới"
              trigger="click"
              placement="bottomRight"
              arrow={false}
            >
              <Badge count={notificationsList.length} size="small" style={{ cursor: 'pointer' }}>
                <Button type="text" icon={<BellOutlined style={{ fontSize: 20 }} />} />
              </Badge>
            </Popover>

            <Dropdown menu={userMenuProps} trigger={['click']}>
              <Space style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }}>
                <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                  <span style={{ fontWeight: 600 }}>{localStorage.getItem('fullName') || 'Cư dân'}</span>
                  <span style={{ fontSize: 12, color: '#888' }}>Mã hộ: {localStorage.getItem('householdCode') || '-'}</span>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)'
            }}
          >
            <Outlet />
          </div>
        </Content>

        <Footer style={{ textAlign: 'center', color: '#888' }}>
          BlueSky Apartment ©{new Date().getFullYear()} - Cổng thông tin cư dân
        </Footer>
      </Layout>
    </Layout>
  );
};

export default ResidentLayout;
