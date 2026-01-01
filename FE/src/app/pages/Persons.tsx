import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, message, Pagination } from "antd";
import { api } from "../services/api";
import TableCustom from "../components/TableCustom";
import PersonForm from "../components/PersonForm";
import { useParams } from 'react-router-dom'; 

interface Person {
  id: string;
  name: string;
  age: number;
  relation: string;
  householdId: string;
}

const Persons: React.FC = () => { 
  const { householdId } = useParams<{ householdId: string }>();
  const [persons, setPersons] = useState<Person[]>([]);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [form] = Form.useForm();

  const fetchPersons = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/households/${householdId}/persons/search`, {
        params: { keyword, page, size: 10 },
      });
      setPersons(res.data.content || res.data);
      setTotal(res.data.totalElements ?? res.data.total ?? 0);
    } catch (err: any) {
      message.error(err.response?.data?.message || "Lỗi tải danh sách nhân khẩu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersons();
  }, [page, householdId]);

  const handleSearch = () => {
    setPage(0);
    fetchPersons();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingPerson) {
        await api.put(`/persons/${editingPerson.id}`, values);
        message.success("Cập nhật nhân khẩu thành công!");
      } else {
        await api.post(`/households/${householdId}/persons`, values);
        message.success("Thêm nhân khẩu thành công!");
      }
      setIsModalOpen(false);
      setEditingPerson(null);
      form.resetFields();
      fetchPersons();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Lỗi khi lưu nhân khẩu");
    }
  };

  const handleEdit = (person: Person) => {
    setEditingPerson(person);
    setIsModalOpen(true);
    form.setFieldsValue(person);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/persons/${id}`);
      message.success("Xóa nhân khẩu thành công!");
      fetchPersons();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Lỗi khi xóa nhân khẩu");
    }
  };

  const columns = [
    { title: "Tên", dataIndex: "name" as keyof Person },
    { title: "Tuổi", dataIndex: "age" as keyof Person },
    { title: "Quan hệ", dataIndex: "relation" as keyof Person },
    {
      title: "Hành động",
      render: (_: any, record: Person) => (
        <>
          <Button onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
            Sửa
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>Xóa</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <Input
          placeholder="Tìm theo tên / quan hệ"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onPressEnter={handleSearch}
          style={{ maxWidth: 360 }}
        />
        <Button type="primary" onClick={handleSearch}>Tìm kiếm</Button>
        <Button
          onClick={() => {
            setKeyword("");
            setPage(0);
            fetchPersons();
          }}
        >
          Xóa lọc
        </Button>
        <Button
          type="primary"
          style={{ marginLeft: "auto" }}
          onClick={() => {
            setEditingPerson(null);
            setIsModalOpen(true);
            form.resetFields();
          }}
        >
          Thêm nhân khẩu
        </Button>
      </div>

      <TableCustom columns={columns} dataSource={persons} rowKey="id" loading={loading} />

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
        <Pagination
          current={page + 1}
          pageSize={10}
          total={total}
          onChange={(p) => setPage(p - 1)}
          showSizeChanger={false}
        />
      </div>

      <Modal
        title={editingPerson ? "Sửa nhân khẩu" : "Thêm nhân khẩu"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingPerson(null);
          form.resetFields();
        }}
      >
        <PersonForm form={form} editingPerson={editingPerson || undefined} />
      </Modal>
    </div>
  );
};

export default Persons;

