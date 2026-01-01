import React from "react";
import { Form, Input, Select } from "antd";

interface FeePaymentFormProps {
  form: any; // FormInstance từ antd
}

const FeePaymentForm: React.FC<FeePaymentFormProps> = ({ form }) => {
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        label="Số tiền nộp"
        name="paidAmount"
        rules={[{ required: true, message: "Vui lòng nhập số tiền" }]}
      >
        <Input type="number" placeholder="Nhập số tiền nộp" />
      </Form.Item>

      <Form.Item
        label="Người nộp"
        name="payerName"
        rules={[{ required: true, message: "Vui lòng nhập tên người nộp" }]}
      >
        <Input placeholder="Nhập tên người nộp" />
      </Form.Item>

      <Form.Item
        label="Phương thức thanh toán"
        name="paymentMethod"
        rules={[{ required: true, message: "Vui lòng chọn phương thức" }]}
      >
        <Select placeholder="Chọn phương thức">
          <Select.Option value="CASH">Tiền mặt</Select.Option>
          <Select.Option value="BANK_TRANSFER">Chuyển khoản</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="Ghi chú" name="note">
        <Input.TextArea placeholder="Nhập ghi chú (nếu có)" />
      </Form.Item>
    </Form>
  );
};

export default FeePaymentForm;
