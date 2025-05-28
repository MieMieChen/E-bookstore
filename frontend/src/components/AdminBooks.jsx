import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, Modal, Form, InputNumber, message, Upload } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getBooks, searchBooks,addBook,updateBook,deleteBook } from '../services/book';

const { Search } = Input;

export function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [form] = Form.useForm();

  // 复用已有的获取图书列表和搜索API
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (error) {
      message.error('获取图书列表失败');
    }
  };

  const handleSearch = async (value) => {
    if (!value) {
      fetchBooks();
      return;
    }
    try {
      const data = await searchBooks('title', value);
      setBooks(data);
    } catch (error) {
      message.error('搜索图书失败');
    }
  };

  const handleAdd = () => {
    setEditingBook(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingBook(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (bookId) => {
    try {
      await deleteBook(bookId);
      message.success('删除成功');
      fetchBooks();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingBook) {
        await updateBook(editingBook.id, values);
        message.success('更新成功');
      } else {
        await addBook(values);
        message.success('添加成功');
      }
      setIsModalVisible(false);
      fetchBooks();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const columns = [
    {
      title: '封面',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl) => (
        <img src={imageUrl} alt="封面" style={{ width: 50, height: 50, objectFit: 'cover' }} />
      ),
    },
    {
      title: '书名',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'ISBN',
      dataIndex: 'isbn',
      key: 'isbn',
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `¥${price}`,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加图书
        </Button>
        <Search
          placeholder="请输入书名搜索"
          allowClear
          enterButton={<SearchOutlined />}
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
      </Space>

      <Table
        columns={columns}
        dataSource={books}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingBook ? '编辑图书' : '添加图书'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="书名"
            rules={[{ required: true, message: '请输入书名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="author"
            label="作者"
            rules={[{ required: true, message: '请输入作者' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="isbn"
            label="ISBN"
            rules={[{ required: true, message: '请输入ISBN' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="stock"
            label="库存"
            rules={[{ required: true, message: '请输入库存' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="price"
            label="价格"
            rules={[{ required: true, message: '请输入价格' }]}
          >
            <InputNumber min={0} precision={2} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="imageUrl"
            label="封面图片URL"
            rules={[{ required: true, message: '请输入封面图片URL' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}