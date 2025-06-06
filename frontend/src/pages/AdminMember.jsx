import { useState, useEffect } from 'react';
import { Table, Space, Button, Input,  message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllUsers,setUserInvalid,setUserValid } from '../services/user';


export function AdminMemberPage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);


  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      console.log("users:", data);
      setUser(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };


  const validateUser = async (id) => {
    try {
      await setUserValid(id);
      message.success('用户已解禁');
      fetchAllUsers(); // 重新获取用户列表
    } catch (error) {
      message.error('解禁用户失败');
    }
  };

  const invalidateUser = async (id) => {
    try {
      await setUserInvalid(id);
      message.success('用户已禁用');
      fetchAllUsers(); // 重新获取用户列表
    } catch (error) {
      message.error('禁用用户失败');
    }
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
        title: '当前状态',
      dataIndex: 'valid',
      key: 'valid',
      render: (valid) => (
        <span style={{ color: valid === 1 ? 'green' : 'red' }}>
          {valid === 1 ? '正常' : '已禁用'}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.valid === 0 && (
            <Button type="primary" icon={<EditOutlined />} onClick={() => validateUser(record.id)}>
              解禁
            </Button>
          )}
          {record.valid === 1 && (
            <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => invalidateUser(record.id)}>
              禁用
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (

    <div style={{ padding: '24px' }}>
        <h1>用户管理</h1>
      <Table
        columns={columns}
        dataSource={user}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
}