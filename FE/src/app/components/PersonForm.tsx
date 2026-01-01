import React from 'react';
import { Form, Input } from 'antd';

interface PersonFormProps {
  form: any;
  editingPerson?: { id: string; name: string; age: number; relation: string };
}

const PersonForm: React.FC<PersonFormProps> = ({ form }) => {
  return (
    <Form form={form} layout="vertical">
      <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="age" label="Tuổi" rules={[{ required: true }]}>
        <Input type="number" />
      </Form.Item>
      <Form.Item name="relation" label="Quan hệ với chủ hộ" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
    </Form>
  );
};

export default PersonForm;
