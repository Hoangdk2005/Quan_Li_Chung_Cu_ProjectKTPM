import React, { useEffect, useState } from "react";
import { Form, Input, DatePicker, Select, message } from "antd";
import { api } from "../../services/api";

interface HouseholdFormProps {
  form: any; // FormInstance từ antd
}

interface Apartment {
  id: string;
  block: string;
  floor: string;
  unit: string;
  status: string;
}

const HouseholdForm: React.FC<HouseholdFormProps> = ({ form }) => {
  const [apartments, setApartments] = useState<Apartment[]>([]);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const res = await api.get("/apartments");
        // Lấy tất cả căn hộ để có thể chọn (bao gồm cả căn hộ đang ở nếu đang edit)
        setApartments(res.data.content || res.data);
      } catch (err: any) {
        message.error(err.response?.data?.message || "Lỗi tải danh sách căn hộ");
      }
    };
    fetchApartments();
  }, []);

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        label="Mã hộ khẩu"
        name="householdId"
        rules={[{ required: true, message: "Vui lòng nhập mã hộ khẩu" }]}
      >
        <Input placeholder="Nhập mã hộ khẩu" />
      </Form.Item>

      <Form.Item
        label="Căn hộ"
        name="apartmentIds"
        rules={[{ required: true, message: "Vui lòng chọn ít nhất một căn hộ" }]}
      >
        <Select 
          mode="multiple"
          placeholder="Chọn một hoặc nhiều căn hộ"
          optionFilterProp="children"
          showSearch
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {apartments.map((apt) => (
            <Select.Option key={apt.id} value={Number(apt.id)}>
              {`${apt.block}-${apt.floor}-${apt.unit}${apt.status === 'OCCUPIED' ? ' (Đã có người ở)' : ''}`}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Tên chủ hộ"
        name="ownerName"
        rules={[{ required: true, message: "Vui lòng nhập tên chủ hộ" }]}
      >
        <Input placeholder="Nhập tên chủ hộ" />
      </Form.Item>

      <Form.Item
        label="Số điện thoại"
        name="phone"
        rules={[
          { required: true, message: "Vui lòng nhập số điện thoại" },
          { pattern: /^[0-9]{9,11}$/, message: "Số điện thoại không hợp lệ" },
        ]}
      >
        <Input placeholder="Nhập số điện thoại" />
      </Form.Item>

      <Form.Item
        label="Địa chỉ"
        name="address"
      >
        <Input placeholder="Nhập địa chỉ (nếu có)" />
      </Form.Item>

      <Form.Item
        label="Ngày nhập hộ"
        name="moveInDate"
        rules={[{ required: true, message: "Vui lòng chọn ngày nhập hộ" }]}
      >
        <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Trạng thái"
        name="status"
        rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
      >
        <Select placeholder="Chọn trạng thái">
          <Select.Option value="ACTIVE">Đang ở</Select.Option>
          <Select.Option value="MOVED_OUT">Đã chuyển đi</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  );
};

export default HouseholdForm;
