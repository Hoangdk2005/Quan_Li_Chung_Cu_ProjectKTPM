// src/app/pages/resident/ResidentProfile.tsx
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Descriptions, Table, Tag, Avatar, Spin, Empty, Button, Modal, Form, Input, Select, DatePicker, message, Popconfirm } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  TeamOutlined,
  CarOutlined,
  PhoneOutlined,
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { api } from '../../services/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

interface Household {
  id: string;
  householdId: string;
  ownerName: string;
  phone: string;
  address: string;
  moveInDate: string;
  status: string;
}

interface Resident {
  id: string;
  householdId: string;
  fullName: string;
  dob: string;
  gender: string;
  idNumber: string;
  phone: string;
  relationshipToHead: string;
  isHead: boolean;
  status: string;
}

interface Vehicle {
  id: string;
  householdId: string;
  type: string;
  plate: string;
  brand: string;
  color: string;
  status: string;
}

const ResidentProfile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [household, setHousehold] = useState<Household | null>(null);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  
  // Modal states for Resident
  const [residentModalVisible, setResidentModalVisible] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [residentForm] = Form.useForm();
  
  // Modal states for Vehicle
  const [vehicleModalVisible, setVehicleModalVisible] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [vehicleForm] = Form.useForm();

  const householdId = localStorage.getItem('householdId') || '1';

  const fetchData = async () => {
    setLoading(true);
    try {
      // Lấy thông tin hộ gia đình
      const hhRes = await api.get(`/households/${householdId}`);
      setHousehold(hhRes.data);

      // Lấy danh sách thành viên
      const resRes = await api.get(`/households/${householdId}/residents`);
      setResidents(resRes.data || []);

      // Lấy danh sách phương tiện
      const vehRes = await api.get(`/households/${householdId}/vehicles`);
      setVehicles(vehRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [householdId]);

  // Resident handlers
  const handleAddResident = () => {
    setEditingResident(null);
    residentForm.resetFields();
    residentForm.setFieldsValue({
      householdId: Number(householdId),
      gender: 'Male',
      status: 'ACTIVE',
    });
    setResidentModalVisible(true);
  };

  const handleEditResident = (record: Resident) => {
    setEditingResident(record);
    residentForm.setFieldsValue({
      ...record,
      householdId: Number(householdId),
      dob: record.dob ? dayjs(record.dob) : null,
    });
    setResidentModalVisible(true);
  };

  const handleDeleteResident = async (id: string) => {
    try {
      await api.delete(`/residents/${id}`);
      message.success('Đã xóa thành viên');
      fetchData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Không thể xóa thành viên');
    }
  };

  const handleResidentSubmit = async () => {
    try {
      const values = await residentForm.validateFields();
      const data = {
        ...values,
        householdId: Number(householdId),
        dob: values.dob ? dayjs(values.dob).format('YYYY-MM-DD') : null,
      };

      if (editingResident) {
        await api.put(`/residents/${editingResident.id}`, data);
        message.success('Đã cập nhật thông tin thành viên');
      } else {
        await api.post('/residents', data);
        message.success('Đã thêm thành viên mới');
      }
      setResidentModalVisible(false);
      fetchData();
    } catch (error: any) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      }
    }
  };

  // Vehicle handlers
  const handleAddVehicle = () => {
    setEditingVehicle(null);
    vehicleForm.resetFields();
    vehicleForm.setFieldsValue({
      householdId: Number(householdId),
      type: 'Motorbike',
      status: 'Active',
    });
    setVehicleModalVisible(true);
  };

  const handleEditVehicle = (record: Vehicle) => {
    setEditingVehicle(record);
    vehicleForm.setFieldsValue({
      ...record,
      householdId: Number(householdId),
    });
    setVehicleModalVisible(true);
  };

  const handleDeleteVehicle = async (id: string) => {
    try {
      await api.delete(`/vehicles/${id}`);
      message.success('Đã xóa phương tiện');
      fetchData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Không thể xóa phương tiện');
    }
  };

  const handleVehicleSubmit = async () => {
    try {
      const values = await vehicleForm.validateFields();
      const data = {
        ...values,
        householdId: Number(householdId),
      };

      if (editingVehicle) {
        await api.put(`/vehicles/${editingVehicle.id}`, data);
        message.success('Đã cập nhật thông tin phương tiện');
      } else {
        await api.post('/vehicles', data);
        message.success('Đã thêm phương tiện mới');
      }
      setVehicleModalVisible(false);
      fetchData();
    } catch (error: any) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      }
    }
  };

  const residentColumns: ColumnsType<Resident> = [
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar size="small" icon={<UserOutlined />} />
          <Text strong>{text}</Text>
          {record.relationshipToHead === 'Chủ hộ' && (
            <Tag color="gold">Chủ hộ</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dob',
      key: 'dob',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => (gender === 'Male' ? 'Nam' : 'Nữ'),
    },
    {
      title: 'Quan hệ với chủ hộ',
      dataIndex: 'relationshipToHead',
      key: 'relationshipToHead',
    },
    {
      title: 'CCCD/CMND',
      dataIndex: 'idNumber',
      key: 'idNumber',
      render: (text) => text || '-',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap: Record<string, { color: string; label: string }> = {
          'ACTIVE': { color: 'green', label: 'Đang ở' },
          'TAM_VANG': { color: 'orange', label: 'Tạm vắng' },
          'MOVED_OUT': { color: 'red', label: 'Đã chuyển đi' },
        };
        const s = statusMap[status] || { color: 'default', label: status };
        return <Tag color={s.color}>{s.label}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditResident(record)}
          >
            Sửa
          </Button>
          {!record.isHead && (
            <Popconfirm
              title="Xác nhận xóa thành viên?"
              description="Bạn có chắc chắn muốn xóa thành viên này?"
              onConfirm={() => handleDeleteResident(record.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button type="link" danger icon={<DeleteOutlined />}>
                Xóa
              </Button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  const vehicleColumns: ColumnsType<Vehicle> = [
    {
      title: 'Loại xe',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <span>
          <CarOutlined style={{ marginRight: 8 }} />
          {type === 'Motorbike' ? 'Xe máy' : type === 'Car' ? 'Ô tô' : type === 'Bicycle' ? 'Xe đạp' : type}
        </span>
      ),
    },
    {
      title: 'Biển số',
      dataIndex: 'plate',
      key: 'plate',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Hãng xe',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: 'Màu sắc',
      dataIndex: 'color',
      key: 'color',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'green' : 'red'}>
          {status === 'Active' ? 'Đang sử dụng' : 'Ngừng sử dụng'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditVehicle(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa phương tiện?"
            description="Bạn có chắc chắn muốn xóa phương tiện này?"
            onConfirm={() => handleDeleteVehicle(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!household) {
    return <Empty description="Không tìm thấy thông tin hộ gia đình" />;
  }

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        <UserOutlined style={{ marginRight: 8 }} />
        Thông tin cá nhân
      </Title>

      {/* Thông tin căn hộ */}
      <Card
        title={
          <span>
            <HomeOutlined style={{ marginRight: 8 }} />
            Thông tin căn hộ
          </span>
        }
        style={{ marginBottom: 16 }}
      >
        <Row gutter={[24, 16]}>
          <Col xs={24} md={8}>
            <div
              style={{
                textAlign: 'center',
                padding: 24,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 8,
                color: '#fff',
              }}
            >
              <Avatar size={80} style={{ backgroundColor: '#fff', color: '#667eea' }}>
                <span style={{ fontSize: 28, fontWeight: 'bold' }}>{household.address}</span>
              </Avatar>
              <Title level={4} style={{ color: '#fff', marginTop: 16, marginBottom: 4 }}>
                Căn hộ {household.address}
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
                Mã hộ: {household.householdId}
              </Text>
            </div>
          </Col>
          <Col xs={24} md={16}>
            <Descriptions column={{ xs: 1, sm: 2 }} labelStyle={{ fontWeight: 500 }}>
              <Descriptions.Item
                label={
                  <span>
                    <UserOutlined style={{ marginRight: 6 }} />
                    Chủ hộ
                  </span>
                }
              >
                <Text strong>{household.ownerName}</Text>
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span>
                    <PhoneOutlined style={{ marginRight: 6 }} />
                    Số điện thoại
                  </span>
                }
              >
                {household.phone}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span>
                    <HomeOutlined style={{ marginRight: 6 }} />
                    Địa chỉ
                  </span>
                }
              >
                {household.address}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span>
                    <CalendarOutlined style={{ marginRight: 6 }} />
                    Ngày chuyển đến
                  </span>
                }
              >
                {household.moveInDate}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span>
                    <TeamOutlined style={{ marginRight: 6 }} />
                    Số thành viên
                  </span>
                }
              >
                {residents.length} người
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span>
                    <CarOutlined style={{ marginRight: 6 }} />
                    Số phương tiện
                  </span>
                }
              >
                {vehicles.length} xe
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>

      {/* Danh sách thành viên */}
      <Card
        title={
          <span>
            <TeamOutlined style={{ marginRight: 8 }} />
            Thành viên trong hộ ({residents.length})
          </span>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddResident}>
            Thêm thành viên
          </Button>
        }
        style={{ marginBottom: 16 }}
      >
        {residents.length === 0 ? (
          <Empty description="Chưa có thông tin thành viên" />
        ) : (
          <Table
            columns={residentColumns}
            dataSource={residents}
            rowKey="id"
            pagination={false}
          />
        )}
      </Card>

      {/* Danh sách phương tiện */}
      <Card
        title={
          <span>
            <CarOutlined style={{ marginRight: 8 }} />
            Phương tiện đăng ký ({vehicles.length})
          </span>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddVehicle}>
            Thêm phương tiện
          </Button>
        }
      >
        {vehicles.length === 0 ? (
          <Empty description="Chưa có phương tiện đăng ký" />
        ) : (
          <Table
            columns={vehicleColumns}
            dataSource={vehicles}
            rowKey="id"
            pagination={false}
          />
        )}
      </Card>

      {/* Modal thêm/sửa thành viên */}
      <Modal
        title={editingResident ? 'Sửa thông tin thành viên' : 'Thêm thành viên mới'}
        open={residentModalVisible}
        onOk={handleResidentSubmit}
        onCancel={() => setResidentModalVisible(false)}
        okText={editingResident ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
        width={600}
      >
        <Form form={residentForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="dob" label="Ngày sinh">
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="Chọn ngày sinh" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="gender" label="Giới tính">
                <Select>
                  <Option value="Male">Nam</Option>
                  <Option value="Female">Nữ</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="idNumber" label="CCCD/CMND">
                <Input placeholder="Nhập số CCCD/CMND" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="phone" label="Số điện thoại">
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="relationshipToHead" label="Quan hệ với chủ hộ">
                <Select placeholder="Chọn quan hệ">
                  <Option value="Chủ hộ">Chủ hộ</Option>
                  <Option value="Vợ/Chồng">Vợ/Chồng</Option>
                  <Option value="Con">Con</Option>
                  <Option value="Cha/Mẹ">Cha/Mẹ</Option>
                  <Option value="Anh/Chị/Em">Anh/Chị/Em</Option>
                  <Option value="Khác">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="status" label="Trạng thái">
                <Select>
                  <Option value="ACTIVE">Đang ở</Option>
                  <Option value="TAM_VANG">Tạm vắng</Option>
                  <Option value="MOVED_OUT">Đã chuyển đi</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Modal thêm/sửa phương tiện */}
      <Modal
        title={editingVehicle ? 'Sửa thông tin phương tiện' : 'Thêm phương tiện mới'}
        open={vehicleModalVisible}
        onOk={handleVehicleSubmit}
        onCancel={() => setVehicleModalVisible(false)}
        okText={editingVehicle ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
        width={500}
      >
        <Form form={vehicleForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Loại xe"
                rules={[{ required: true, message: 'Vui lòng chọn loại xe' }]}
              >
                <Select>
                  <Option value="Motorbike">Xe máy</Option>
                  <Option value="Car">Ô tô</Option>
                  <Option value="Bicycle">Xe đạp</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="plate"
                label="Biển số"
                rules={[{ required: true, message: 'Vui lòng nhập biển số' }]}
              >
                <Input placeholder="Nhập biển số xe" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="brand" label="Hãng xe">
                <Input placeholder="Nhập hãng xe" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="color" label="Màu sắc">
                <Input placeholder="Nhập màu sắc" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="status" label="Trạng thái">
                <Select>
                  <Option value="Active">Đang sử dụng</Option>
                  <Option value="Inactive">Ngừng sử dụng</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ResidentProfile;
