import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, message, Pagination } from "antd";
import { api } from "../services/api";
import TableCustom from "../components/TableCustom";
import UserForm from "../components/UserForm";

interface User {
  id: string;
  username: string;
  fullName: string;
  role: "admin" | "user";
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/users/search`, {
        params: { keyword, page, size: 10 },
      });
      setUsers(res.data.content || res.data);
      setTotal(res.data.totalElements ?? res.data.total ?? 0);
    } catch (err: any) {
      message.error(err.response?.data?.message || "Lỗi tải danh sách tài khoản");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleSearch = () => {
    setPage(0);
    fetchUsers();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, values);
        message.success("Cập nhật tài khoản thành công!");
      } else {
        await api.post("/users", values);
        message.success("Thêm tài khoản thành công!");
      }
      setIsModalOpen(false);
      setEditingUser(null);
      form.resetFields();
      fetchUsers();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Lỗi khi lưu tài khoản");
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
    form.setFieldsValue(user);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/users/${id}`);
      message.success("Xóa tài khoản thành công!");
      fetchUsers();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Lỗi khi xóa tài khoản");
    }
  };

  const columns = [
    { title: "Tên tài khoản", dataIndex: "username" as keyof User },
    { title: "Họ tên", dataIndex: "fullName" as keyof User },
    { title: "Vai trò", dataIndex: "role" as keyof User },
    {
      title: "Hành động",
      render: (_: any, record: User) => (
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
          placeholder="Tìm theo username / họ tên"
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
            fetchUsers();
          }}
        >
          Xóa lọc
        </Button>
        <Button
          type="primary"
          style={{ marginLeft: "auto" }}
          onClick={() => {
            setEditingUser(null);
            setIsModalOpen(true);
            form.resetFields();
          }}
        >
          Thêm tài khoản
        </Button>
      </div>

      <TableCustom columns={columns} dataSource={users} rowKey="id" loading={loading} />

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
        title={editingUser ? "Sửa tài khoản" : "Thêm tài khoản"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingUser(null);
          form.resetFields();
        }}
      >
        <UserForm form={form} editingUser={editingUser || undefined} />
      </Modal>
    </div>
  );
};

export default Users;

/*import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';

interface User {
  id: string;
  username: string;
  role: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Mock data
    setUsers([
      { id: '1', username: 'admin', role: 'Quản trị' },
      { id: '2', username: 'user01', role: 'Người dùng' },
      { id: '3', username: 'user02', role: 'Người dùng' },
    ]);
  }, []);

  const columns = [
    { title: 'Tên tài khoản', dataIndex: 'username', key: 'username' },
    { title: 'Vai trò', dataIndex: 'role', key: 'role' },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" style={{ marginBottom: 16 }}>
        Thêm tài khoản
      </Button>
      <Table dataSource={users} columns={columns} rowKey="id" />
    </div>
  );
};

export default Users;*/

