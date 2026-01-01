// src/components/MainLayout.tsx
import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, Button, Avatar, Dropdown, Space, Breadcrumb, Badge, Popover, List, Typography } from 'antd';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  PieChartOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  TeamOutlined,
  CarOutlined,
  BankOutlined,
  FileTextOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  AppstoreOutlined,
  BuildOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';


const ROLES = {
  ADMIN: 'ADMIN',
  KE_TOAN: 'KE_TOAN',
  TO_TRUONG: 'TO_TRUONG',
};
const { Header, Content, Footer, Sider } = Layout;


// Helper để tạo menu item gọn hơn
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

// Cấu trúc Menu đầy đủ chức năng
const items: MenuItem[] = [
  getItem('Dashboard', '/dashboard', <PieChartOutlined />),
  
  getItem('Quản lý Cư dân', 'sub1', <TeamOutlined />, [
    getItem('Danh sách Căn hộ', '/apartments', <BuildOutlined />),
    getItem('Danh sách Hộ dân', '/households', <HomeOutlined />),
    getItem('Thông tin Cư dân', '/residents', <UserOutlined />), // Cần tạo route này sau
    getItem('Quản lý Phương tiện', '/vehicles', <CarOutlined />), // Cần tạo route này sau
  ]),

  getItem('Quản lý Phí & Dịch vụ', 'sub2', <BankOutlined />, [
    getItem('Danh mục Phí', '/fee-items', <AppstoreOutlined />),
    getItem('Đợt thu phí', '/fee-periods', <FileTextOutlined />),
    getItem('Danh sách Công nợ', '/fee-obligations', <BankOutlined />),
  ]),

  getItem('Hệ thống', 'sub3', <SettingOutlined />, [
    getItem('Tài khoản Admin', '/users', <UserOutlined />),
    getItem('Cài đặt chung', '/settings'),
  ]),
];

// Map đường dẫn sang tên hiển thị cho Breadcrumb
const breadcrumbNameMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/apartments': 'Danh sách Căn hộ',
  '/households': 'Danh sách Hộ dân',
  '/residents': 'Thông tin Cư dân',
  '/vehicles': 'Quản lý Phương tiện',
  '/fee-items': 'Danh mục Phí',
  '/fee-periods': 'Đợt thu phí',
  '/fee-obligations': 'Danh sách Công nợ',
  '/users': 'Tài khoản Admin',
  '/settings': 'Cài đặt',
};

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation();
  const { Text } = Typography;
  const notificationsList = [
      { title: 'Thông báo phí T10', description: 'Vui lòng đóng phí quản lý trước ngày 30/10' },
      { title: 'Bảo trì thang máy', description: 'Thang máy B sẽ bảo trì vào ngày mai' },
      { title: 'Họp tổ dân phố', description: 'Kính mời cư dân tham gia họp lúc 19h' },
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
        <Button type="link" block onClick={() => navigate('/notifications')}>
          Xem tất cả thông báo
        </Button>
      </div>
    );

  // Xử lý logic Breadcrumb
  const pathSnippets = location.pathname.split('/').filter((i) => i);
  const breadcrumbItems = [
    { title: <Link to="/dashboard">Home</Link>, key: 'home' },
    ...pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      return {
        key: url,
        title: breadcrumbNameMap[url] || url, // Fallback nếu không tìm thấy tên
      };
    }),
  ];
  const userRole = localStorage.getItem('role') || ROLES.ADMIN;

  // Xây dựng menu động theo Role
  const getMenuItems = (role: string): MenuItem[] => {
    const menus: MenuItem[] = [
      getItem('Dashboard', '/dashboard', <PieChartOutlined />),
    ];

    // Quản lý dân cư - hiển thị cho tất cả (ADMIN, TO_TRUONG, hoặc mặc định)
    menus.push(
      getItem('Quản lý Cư dân', 'sub1', <TeamOutlined />, [
        getItem('Danh sách Căn hộ', '/apartments', <BuildOutlined />),
        getItem('Danh sách Hộ dân', '/households', <HomeOutlined />),
        getItem('Thông tin Cư dân', '/residents', <UserOutlined />),
        getItem('Quản lý Phương tiện', '/vehicles', <CarOutlined />),
      ])
    );

    // Quản lý thu phí - hiển thị cho tất cả (ADMIN, KE_TOAN, hoặc mặc định)
    menus.push(
      getItem('Quản lý Phí & Dịch vụ', 'sub2', <BankOutlined />, [
        getItem('Danh mục Phí', '/fee-items', <AppstoreOutlined />),
        getItem('Đợt thu phí', '/fee-periods', <FileTextOutlined />),
        getItem('Danh sách Công nợ', '/fee-obligations', <BankOutlined />),
      ]),
      getItem('Thông báo', '/notifications', <BellOutlined />)
    );

    // Hệ thống - hiển thị cho ADMIN
    if (role === ROLES.ADMIN || !role) {
      menus.push(
        getItem('Hệ thống', 'sub3', <SettingOutlined />, [
          getItem('Tài khoản Admin', '/users', <UserOutlined />),
          getItem('Cài đặt chung', '/settings'),
        ])
      );
    }

    return menus;
  };

  const items = getMenuItems(userRole);
  // Menu Dropdown cho User Profile
  const userMenuProps: MenuProps = {
    items: [
      {
        key: 'profile',
        label: 'Thông tin cá nhân',
        icon: <UserOutlined />,
      },
      {
        key: 'settings',
        label: 'Cài đặt',
        icon: <SettingOutlined />,
      },
      {
        type: 'divider',
      },
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

  // Xác định menu đang active và mở rộng
  const selectedKey = location.pathname;
  // Logic đơn giản để mở submenu (nếu path chứa sub key thì mở)
  // Thực tế có thể map chính xác hơn, ở đây demo mở default
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        width={250}
        style={{
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 10
        }}
      >
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
           {/* Logo giả lập */}
           <div style={{ 
             width: 32, height: 32, background: '#1890ff', borderRadius: 6, marginRight: collapsed ? 0 : 8 
           }} />
           {!collapsed && (
             <span style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', whiteSpace: 'nowrap' }}>
               BMS Admin
             </span>
           )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultOpenKeys={['sub1', 'sub2']} // Mặc định mở nhóm quản lý
          selectedKeys={[selectedKey]}
          items={items}
          onClick={onMenuClick}
          style={{ borderRight: 0 }}
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
          {/* Left Header: Toggle & Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
                marginRight: 16
              }}
            />
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* Right Header: Notification & Profile */}
          <Space size={24}>
           {/* --- PHẦN THÔNG BÁO MỚI --- */}
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
            {/* ------------------------- */}

            <Dropdown menu={userMenuProps} trigger={['click']}>
                <Space style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 6, transition: 'background 0.3s' }} className="user-dropdown">
                    <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                        <span style={{ fontWeight: 600 }}>Admin User</span>
                        <span style={{ fontSize: 12, color: '#888' }}>Quản trị viên</span>
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
              // Thêm shadow nhẹ cho nội dung chính
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)' 
            }}
          >
            <Outlet />
          </div>
        </Content>

        <Footer style={{ textAlign: 'center', color: '#888' }}>
          Building Management System ©{new Date().getFullYear()} Created by You
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;