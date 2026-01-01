import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { 
    username: string; 
    fullName: string;
    email: string; 
    phone: string;
    password: string; 
    confirmPassword: string 
  }) => {
    setLoading(true);
    try {
      if (values.password !== values.confirmPassword) {
        message.error('Mật khẩu xác nhận không khớp!');
        return;
      }

      // Gọi API đăng ký
      const res = await axios.post('http://localhost:8080/api/auth/register', {
        username: values.username,
        password: values.password,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone
      });

      if (res.data?.success) {
        message.success('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login');
      } else {
        message.error(res.data?.message || 'Đăng ký thất bại!');
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.message || 'Lỗi đăng ký!';
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
      <Card style={{ 
        width: 420, 
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        borderRadius: 12
      }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <Title level={3} style={{ margin: 0 }}>Đăng ký tài khoản</Title>
          <Text type="secondary">Tạo tài khoản cư dân mới</Text>
          <div style={{ 
            marginTop: 8, 
            padding: '6px 12px', 
            background: '#f0f5ff', 
            borderRadius: 6,
            border: '1px solid #d6e4ff'
          }}>
            <Text style={{ fontSize: 12, color: '#1890ff' }}>
              Lưu ý: Tài khoản đăng ký sẽ có quyền Cư dân (RESIDENT)
            </Text>
          </div>
        </div>

        <Form name="register" onFinish={onFinish} layout="vertical" size="large">
          <Form.Item
            name="username"
            label="Tên tài khoản"
            rules={[
              { required: true, message: 'Vui lòng nhập tên tài khoản!' },
              { min: 4, message: 'Tên tài khoản phải có ít nhất 4 ký tự!' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nhập tên tài khoản" />
          </Form.Item>

          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input prefix={<IdcardOutlined />} placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập lại mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Đăng ký
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            Đã có tài khoản?{' '}
            <a onClick={() => navigate('/login')} style={{ color: '#1677ff' }}>
              Đăng nhập ngay
            </a>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;

