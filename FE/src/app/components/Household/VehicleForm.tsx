import React from "react";
import { Form, Input, Select } from "antd";

interface VehicleFormProps {
  form: any; // FormInstance từ antd
}

const VehicleForm: React.FC<VehicleFormProps> = ({ form }) => {
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        label="Loại xe"
        name="type"
        rules={[{ required: true, message: "Vui lòng chọn loại xe" }]}
      >
        <Select placeholder="Chọn loại xe">
          <Select.Option value="CAR">Ô tô</Select.Option>
          <Select.Option value="MOTORBIKE">Xe máy</Select.Option>
          <Select.Option value="BICYCLE">Xe đạp</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Biển số"
        name="plate"
        rules={[{ required: true, message: "Vui lòng nhập biển số" }]}
      >
        <Input placeholder="Nhập biển số" />
      </Form.Item>

      <Form.Item
        label="Hãng xe"
        name="brand"
        rules={[{ required: true, message: "Vui lòng nhập hãng xe" }]}
      >
        <Input placeholder="Nhập hãng xe" />
      </Form.Item>

      <Form.Item
        label="Màu sắc"
        name="color"
        rules={[{ required: true, message: "Vui lòng nhập màu sắc" }]}
      >
        <Input placeholder="Nhập màu sắc" />
      </Form.Item>

      <Form.Item
        label="Trạng thái"
        name="status"
        rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
      >
        <Select placeholder="Chọn trạng thái">
          <Select.Option value="ACTIVE">Đang sử dụng</Select.Option>
          <Select.Option value="INACTIVE">Ngừng sử dụng</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  );
};

export default VehicleForm;
