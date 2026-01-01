"use client";

import React, { useEffect, useState } from "react";
import { Tabs, Card, Table, Button, message, Modal, Form, Popconfirm, Space, Tag } from "antd";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import ResidentForm from "../components/Household/ResidentForm";
import VehicleForm from "../components/Household/VehicleForm";
import FeePaymentForm from "../components/Household/FeePaymentForm";
import dayjs from 'dayjs';

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
  fullName: string;
  dob: string;
  gender: string;
  idNumber: string;
  relationshipToHead: string;
  status: string;
  isHead?: boolean;
}

interface Vehicle {
  id: string;
  type: string;
  plate: string;
  brand: string;
  color: string;
  status: string;
}

interface Obligation {
  id: string;
  feeItemName: string;
  periodYm: string;
  expectedAmount: number;
  paidAmount: number;
  status: string;
  dueDate: string;
}

const HouseholdDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [household, setHousehold] = useState<Household | null>(null);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [obligations, setObligations] = useState<Obligation[]>([]);

  // State cho modal nhân khẩu
  const [isResidentModalOpen, setIsResidentModalOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [residentForm] = Form.useForm();

  // State cho modal phương tiện 
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false); 
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null); 
  const [vehicleForm] = Form.useForm();

  // State cho modal thu phí 
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); 
  const [editingObligation, setEditingObligation] = useState<Obligation | null>(null); 
  const [paymentForm] = Form.useForm();

  const fetchData = async () => {
    try {
      const [resHousehold, resResidents, resVehicles, resObligations] =
        await Promise.all([
          api.get(`/households/${id}`),
          api.get(`/households/${id}/residents`),
          api.get(`/households/${id}/vehicles`),
          api.get(`/households/${id}/fee-obligations`),
        ]);

      setHousehold(resHousehold.data);
      setResidents(resResidents.data);
      setVehicles(resVehicles.data);
      setObligations(resObligations.data);
    } catch (err: any) {
      message.error(err.response?.data?.message || "Lỗi tải dữ liệu hộ khẩu");
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const handleMoveOut = async () => {
    try {
      await api.patch(`/households/${id}/move-out`);
      message.success("Hộ khẩu đã được chuyển đi!");
      fetchData();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Lỗi khi chuyển đi");
    }
  };

  // Submit thêm/sửa nhân khẩu
  const handleResidentSubmit = async () => {
    try {
      const values = await residentForm.validateFields();
      const payload = {
        ...values,
        householdId: Number(id),
        dob: values.dob ? values.dob.format('YYYY-MM-DD') : null
      };
      if (editingResident) {
        await api.put(`/residents/${editingResident.id}`, payload);
        message.success("Cập nhật nhân khẩu thành công!");
      } else {
        await api.post(`/households/${id}/residents`, payload);
        message.success("Thêm nhân khẩu thành công!");
      }
      setIsResidentModalOpen(false);
      setEditingResident(null);
      residentForm.resetFields();
      fetchData();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Lỗi khi lưu nhân khẩu");
    }
  };

  const handleEditResident = (resident: Resident) => {
    setEditingResident(resident);
    setIsResidentModalOpen(true);
    residentForm.resetFields();
    residentForm.setFieldsValue({
      ...resident,
      dob: resident.dob ? dayjs(resident.dob) : null,
    });
  };

  const handleDeleteResident = async (resident: Resident) => {
    // Kiểm tra nếu là chủ hộ thì không cho xóa
    if (resident.isHead) {
      message.warning("Đây là chủ hộ. Phải chuyển quyền chủ hộ cho người khác trước khi xóa!");
      return;
    }
    
    try {
      await api.delete(`/residents/${resident.id}`);
      message.success("Xóa nhân khẩu thành công!");
      fetchData();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Lỗi khi xóa nhân khẩu");
    }
  };

    // Them sua xoa Phuong Tien
    const handleVehicleSubmit = async () => {
    try {
        const values = await vehicleForm.validateFields();
        if (editingVehicle) {
        await api.put(`/vehicles/${editingVehicle.id}`, values);
        message.success("Cập nhật phương tiện thành công!");
        } else {
        await api.post(`/households/${id}/vehicles`, values);
        message.success("Thêm phương tiện thành công!");
        }
        setIsVehicleModalOpen(false);
        setEditingVehicle(null);
        vehicleForm.resetFields();
        fetchData();
    } catch (err: any) {
        message.error(err.response?.data?.message || "Lỗi khi lưu phương tiện");
    }
    };

    const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsVehicleModalOpen(true);
    vehicleForm.resetFields(); 
    vehicleForm.setFieldsValue(vehicle);
    };

    const handleDeleteVehicle = async (id: string) => {
    try {
        await api.delete(`/vehicles/${id}`);
        message.success("Xóa phương tiện thành công!");
        fetchData(); // reload lại danh sách
    } catch (err: any) {
        message.error(err.response?.data?.message || "Lỗi khi xóa phương tiện");
    }
    };

    // Thu Phi
    const handlePaymentSubmit = async () => {
    try {
        const values = await paymentForm.validateFields();
        await api.patch(`/fee-obligations/${editingObligation?.id}/pay`, values);
        message.success("Thu phí thành công!");
        setIsPaymentModalOpen(false);
        setEditingObligation(null);
        paymentForm.resetFields();
        fetchData();
    } catch (err: any) {
        message.error(err.response?.data?.message || "Lỗi khi thu phí");
    }
    };

    const handlePayObligation = (obligation: Obligation) => {
    setEditingObligation(obligation);
    setIsPaymentModalOpen(true);
    paymentForm.resetFields();
    };


  return (
    <Card
      title={`Chi tiết hộ khẩu: ${household?.householdId ?? ""}`}
      extra={
        household?.status !== "MOVED_OUT" && (
          <Button danger onClick={handleMoveOut}>
            Chuyển đi
          </Button>
        )
      }
    >
      <Tabs defaultActiveKey="info">
        <Tabs.TabPane tab="Thông tin hộ" key="info">
          <p><b>Chủ hộ:</b> {household?.ownerName}</p>
          <p><b>Số điện thoại:</b> {household?.phone}</p>
          <p><b>Địa chỉ:</b> {household?.address}</p>
          <p><b>Ngày nhập hộ:</b> {household?.moveInDate}</p>
          <p><b>Trạng thái:</b> {household?.status}</p>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Nhân khẩu" key="residents">
          <div style={{ marginBottom: 12 }}>
            <Button
              type="primary"
              onClick={() => {
                setEditingResident(null);
                setIsResidentModalOpen(true);
                residentForm.resetFields();
              }}
            >
              Thêm nhân khẩu
            </Button>
          </div>
          <Table
            rowKey="id"
            dataSource={residents}
            columns={[
              { 
                title: "Họ tên", 
                dataIndex: "fullName",
                render: (text: string, record: Resident) => (
                  <>
                    {text} {record.isHead && <Tag color="gold">Chủ hộ</Tag>}
                  </>
                )
              },
              { title: "Ngày sinh", dataIndex: "dob" },
              { title: "Giới tính", dataIndex: "gender" },
              { title: "Số CMND/CCCD", dataIndex: "idNumber" },
              { title: "Quan hệ với chủ hộ", dataIndex: "relationshipToHead" },
              { title: "Trạng thái", dataIndex: "status" },
              {
                title: "Hành động",
                render: (_, record: Resident) => (
                  <Space>
                    <Button onClick={() => handleEditResident(record)}>
                      Sửa
                    </Button>
                    <Popconfirm
                      title="Xác nhận xóa nhân khẩu này?"
                      onConfirm={() => handleDeleteResident(record)}
                      okText="Xóa"
                      cancelText="Hủy"
                      disabled={record.isHead}
                    >
                      <Button 
                        danger 
                        disabled={record.isHead}
                        title={record.isHead ? "Phải chuyển quyền chủ hộ trước khi xóa" : ""}
                      >
                        Xóa
                      </Button>
                    </Popconfirm>
                  </Space>
                ),
              },
            ]}
          />
          <Modal
            title={editingResident ? "Sửa nhân khẩu" : "Thêm nhân khẩu"}
            open={isResidentModalOpen}
            onOk={handleResidentSubmit}
            onCancel={() => {
              setIsResidentModalOpen(false);
              setEditingResident(null);
              residentForm.resetFields();
            }}
          >
            <ResidentForm 
              form={residentForm} 
              isCurrentHead={editingResident?.isHead === true}
            />
          </Modal>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Phương tiện" key="vehicles">
            <div style={{ marginBottom: 12 }}>
                <Button
                type="primary"
                onClick={() => {
                    setEditingVehicle(null);
                    setIsVehicleModalOpen(true);
                    vehicleForm.resetFields();
                }}
                >
                Thêm phương tiện
                </Button>
            </div>
            <Table
                rowKey="id"
                dataSource={vehicles}
                columns={[
                { title: "Loại xe", dataIndex: "type" },
                { title: "Biển số", dataIndex: "plate" },
                { title: "Hãng", dataIndex: "brand" },
                { title: "Màu sắc", dataIndex: "color" },
                { title: "Trạng thái", dataIndex: "status" },
                {
                    title: "Hành động",
                    render: (_: any, record: Vehicle) => (
                    <>
                        <Button
                        onClick={() => handleEditVehicle(record)}
                        style={{ marginRight: 8 }}
                        >
                        Sửa
                        </Button>
                        <Button
                        danger
                        onClick={() => handleDeleteVehicle(record.id)}
                        >
                        Xóa
                        </Button>
                    </>
                    ),
                },
            ]}
        />

            <Modal
                title={editingVehicle ? "Sửa phương tiện" : "Thêm phương tiện"}
                open={isVehicleModalOpen}
                onOk={handleVehicleSubmit}
                onCancel={() => {
                setIsVehicleModalOpen(false);
                setEditingVehicle(null);
                vehicleForm.resetFields();
                }}
            >
                <VehicleForm form={vehicleForm} />
            </Modal>
        </Tabs.TabPane>


        <Tabs.TabPane tab="Nghĩa vụ phí" key="obligations">
            <Table
                rowKey="id"
                dataSource={obligations}
                columns={[
                { title: "Khoản thu", dataIndex: "feeItemName" },
                { title: "Kỳ", dataIndex: "periodYm" },
                { title: "Phải thu", dataIndex: "expectedAmount", render: (v: number) => v?.toLocaleString() + 'đ' },
                { title: "Đã thu", dataIndex: "paidAmount", render: (v: number) => v?.toLocaleString() + 'đ' },
                { title: "Trạng thái", dataIndex: "status" },
                { title: "Hạn nộp", dataIndex: "dueDate" },
                {
                    title: "Hành động",
                    render: (_, record: Obligation) => (
                    <Button type="primary" onClick={() => handlePayObligation(record)}>
                        Thu tiền
                    </Button>
                    ),
                },
                ]}
            />

            <Modal
                title="Thu tiền nghĩa vụ phí"
                open={isPaymentModalOpen}
                onOk={handlePaymentSubmit}
                onCancel={() => {
                setIsPaymentModalOpen(false);
                setEditingObligation(null);
                paymentForm.resetFields();
                }}
            >
                <FeePaymentForm form={paymentForm} />
            </Modal>
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default HouseholdDetail;
