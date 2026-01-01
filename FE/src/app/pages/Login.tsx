import React, { useState } from 'react';
import { Form, Input, Button, message, Card, Typography } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined, HomeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // Gọi API đăng nhập
      const res = await axios.post('http://localhost:8080/api/auth/login', {
        username: values.username,
        password: values.password
      });
      
      if (res.data?.token) {
        // Lưu thông tin đăng nhập
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userId', res.data.userId);
        localStorage.setItem('username', res.data.username);
        localStorage.setItem('fullName', res.data.fullName || '');
        
        // Lưu thông tin hộ gia đình (nếu có)
        if (res.data.householdId) {
          localStorage.setItem('householdId', res.data.householdId);
          localStorage.setItem('householdCode', res.data.householdCode || '');
        }
        
        // Xác định role - ưu tiên role cao nhất
        const roles: string[] = res.data.roles || [];
        let primaryRole = 'RESIDENT';
        if (roles.includes('ADMIN')) {
          primaryRole = 'ADMIN';
        } else if (roles.includes('TO_TRUONG')) {
          primaryRole = 'TO_TRUONG';
        } else if (roles.includes('KE_TOAN')) {
          primaryRole = 'KE_TOAN';
        }
        
        localStorage.setItem('role', primaryRole);
        localStorage.setItem('roles', JSON.stringify(roles));
        
        message.success('Đăng nhập thành công!');
        
        // Chuyển hướng theo role
        if (primaryRole === 'RESIDENT') {
          navigate('/resident/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        message.error('Phản hồi không hợp lệ từ server');
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.message || 'Sai tài khoản hoặc mật khẩu';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card 
        style={{ 
          width: 420, 
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          borderRadius: 12
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ 
            width: 60, 
            height: 60, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <HomeOutlined style={{ fontSize: 28, color: '#fff' }} />
          </div>
          <Title level={3} style={{ margin: 0 }}>BlueSky Apartment</Title>
          <Text type="secondary">Hệ thống quản lý chung cư</Text>
        </div>

        <Form form={form} layout="vertical">
          <Form.Item 
            name="username" 
            label="Tên tài khoản" 
            rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Nhập tên tài khoản"
              size="large"
            />
          </Form.Item>
          <Form.Item 
            name="password" 
            label="Mật khẩu" 
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Nhập mật khẩu"
              size="large"
            />
          </Form.Item>
          <Button type="primary" onClick={handleLogin} block size="large" loading={loading}>
            Đăng nhập
          </Button>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Button type="link" onClick={() => navigate('/register')}>
              Chưa có tài khoản? Đăng ký
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
