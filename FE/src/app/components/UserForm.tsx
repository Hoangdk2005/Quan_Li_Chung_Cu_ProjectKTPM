import React from 'react';
import { Form, Input, Select } from 'antd';

interface UserFormProps {
  form: any;
  editingUser?: { id: string; username: string; fullName: string; role: 'admin' | 'user' };
}

const UserForm: React.FC<UserFormProps> = ({ form, editingUser }) => {
  return (
    <Form form={form} layout="vertical">
      <Form.Item name="username" label="Tên tài khoản" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="fullName" label="Họ tên" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
        <Select>
          <Select.Option value="admin">Admin</Select.Option>
          <Select.Option value="user">User</Select.Option>
        </Select>
      </Form.Item>
      {!editingUser && (
        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
      )}
    </Form>
  );
};

export default UserForm;
