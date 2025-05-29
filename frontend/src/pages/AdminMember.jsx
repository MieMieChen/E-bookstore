
import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, Modal, Form, InputNumber, message, Upload } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getBooks, searchBooks,addBook,updateBook,deleteBook } from '../services/book';
import { getAllUsers } from '../services/user';

const { Search } = Input;

export function AdminMemberPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);


  useEffect(() => {
    console.log("here1111111111111111111111111");
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const data = await getAllUsers();
      console.log("users:",data.data);
      setUser(data);
    } catch (error) {
      message.error('获取用户列表失败');
    }
  };


  const validateUser = (record) => {
    setUserInvalid(record.id);
    setIsModalVisible(true);
  };

  const invalidateUser = (record) => {
    setUserInvalid(record.id);
    setIsModalVisible(true);
  }; 


  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
        title: '注册时间',
      dataIndex: 'registerTime',
      key: 'registerTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => validateUser(record)}>
            解禁
          </Button>
          <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => invalidateUser(record.id)}>
            禁用
          </Button>
        </Space>
      ),
    },
  ];

  return (

    <div style={{ padding: '24px' }}>
        <h1>用户管理</h1>
      <Table
        columns={columns}
        dataSource={books}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
}