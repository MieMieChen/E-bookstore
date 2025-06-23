import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, Modal, Form, InputNumber, message, DatePicker, Pagination } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { searchBooks, addBook, updateBook, deleteBook, restoreBook } from '../services/book';
import dayjs from 'dayjs';

const { Search } = Input;

export function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [form] = Form.useForm();
  const [searchValue, setSearchValue] = useState('');

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchPaginatedBooks = async (page, size, searchVal) => {
    setLoading(true);
    try {
      const result = await searchBooks('title', searchVal, page, size);

      let newBooks = [];
      let totalElements = 0;

      if (Array.isArray(result)) {
        newBooks = result;
        totalElements = result.length;
      } else if (result && result.content) {
        newBooks = result.content;
        totalElements = result.totalElements;
      }

      setBooks(newBooks);
      setPagination(prev => ({
        ...prev,
        total: totalElements,
      }));
      if (newBooks.length === 0 && page > 1) {
          setPagination(prev => ({ ...prev, current: prev.current - 1 }));
      }
    } catch (error) {
      message.error('获取图书列表失败');
      setBooks([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaginatedBooks(pagination.current, pagination.pageSize, searchValue);
  }, [searchValue, pagination.current, pagination.pageSize]);

  const handleSearch = (value) => {
    setPagination(prev => ({ ...prev, current: 1 }));
    setSearchValue(value);
  };

  const handleAdd = () => {
    setEditingBook(null); 
    form.resetFields(); //它会清空所有表单项的内容，让表单回到最初的状态 通常在打开新建/编辑表单前调用，确保表单是干净的，不会显示上一次的数据
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingBook(record);
    const formValues = {
      ...record,
      publishDate: record.publishDate ? dayjs(record.publishDate) : null
    };
    form.setFieldsValue(formValues);
    setIsModalVisible(true);
  };

  const refreshCurrentPage = () => {
    fetchPaginatedBooks(pagination.current, pagination.pageSize, searchValue);
  }

  const handleDelete = async (bookId) => {
    try {
      await deleteBook(bookId);
      message.success('下架成功');
      refreshCurrentPage();
    } catch (error) {
      console.error('下架失败:', error);
      message.error('下架失败');
    }
  };

  const handleRestore = async (bookId) => {
    try {
      await restoreBook(bookId);
      message.success('恢复成功');
      refreshCurrentPage();
    } catch (error) {
      console.error('恢复失败:', error);
      message.error('恢复失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      // 确保 imageUrl 是完整的 URL
      const formData = {
        ...values,
        imageUrl: values.imageUrl // 直接使用完整的 URL，不做任何处理
      };

      setIsModalVisible(false);

      if (editingBook) {
        await updateBook(editingBook.id, formData);
        message.success('更新成功');
      } else {
        await addBook(formData);
        message.success('添加成功');
      }
      refreshCurrentPage();
    } catch (error) {
      console.error("Error caught in handleModalOk:", error);
      message.error('操作失败');
    }
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: pageSize,
    });
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
      title: '出版时间',
      dataIndex: 'publishDate',
      key: 'publishDate',
      render: (publishDate) => publishDate ? dayjs(publishDate).format('YYYY-MM-DD') : ''
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          {record.onShow === 1 ? (
            <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
              下架
            </Button>
          ) : (
            <Button type="primary" icon={<ReloadOutlined />} onClick={() => handleRestore(record.id)}>
              恢复
            </Button>
          )}
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
        pagination={false}
      />

      <Pagination
        style={{ marginTop: 16, textAlign: 'right' }}
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onChange={handlePaginationChange}
        showSizeChanger
        showQuickJumper
        showTotal={(total) => `共 ${total} 条`}
      />

      <Modal
        title={editingBook ? '编辑图书' : '添加图书'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="书名" rules={[{ required: true, message: '请输入书名' }]}><Input /></Form.Item>
          <Form.Item name="author" label="作者" rules={[{ required: true, message: '请输入作者' }]}><Input /></Form.Item>
          <Form.Item name="isbn" label="ISBN" rules={[{ required: true, message: '请输入ISBN' }]}><Input /></Form.Item>
          <Form.Item name="stock" label="库存" rules={[{ required: true, message: '请输入库存' }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="description" label="书籍描述" rules={[{ required: true, message: '请输入书籍描述' }]}><Input.TextArea rows={4} /></Form.Item>
          <Form.Item name="publisher" label="出版社" rules={[{ required: true, message: '请输入出版社' }]}><Input /></Form.Item>
          <Form.Item name="publishDate" label="出版时间" rules={[{ required: true, message: '请选择出版时间' }]}><DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" /></Form.Item>
          <Form.Item name="price" label="价格" rules={[{ required: true, message: '请输入价格' }]}><InputNumber min={0} precision={2} style={{ width: '100%' }} /></Form.Item>
          <Form.Item 
            name="imageUrl" 
            label="封面图片URL" 
            rules={[{ required: true, message: '请输入完整的图片URL' }]}
            tooltip="请输入完整的图片URL地址，包含http://或https://"
          >
            <Input placeholder="请输入完整的图片URL，例如：https://example.com/image.jpg" />
          </Form.Item>
        </Form>
      </Modal>
      
    </div>
  );
}