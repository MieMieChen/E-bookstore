import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, Modal, Form, InputNumber, message, Upload } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getBooks, searchBooks,addBook,updateBook,deleteBook } from '../services/book';

const { Search } = Input;

export function AdminBooks(){ 
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
      console.log("fetching books");
      // setLoading(true);
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
    console.log(record);
    setEditingBook(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // const handleDelete = async (bookId) => {
  //   try {
  //     await deleteBook(bookId);
  //     console.log("Book deleted:", bookId);
  //     message.success('删除成功');
  //     await fetchBooks();
  //   } catch (error) {
  //     message.error('删除失败');
  //   }
  // };
  const handleDelete = async (bookId) => {
  try {
      console.log("1. handleDelete started for bookId:", bookId); // 调试点 1

      console.log("2. Attempting to delete book with ID:", bookId); // 调试点 2
      await deleteBook(bookId); // 假设 deleteBook 是一个异步操作，例如发送 API 请求
      console.log("3. deleteBook operation finished successfully for bookId:", bookId); // 调试点 3

      message.success('删除成功'); // (4)

      console.log("5. Calling fetchBooks to refresh data..."); // 调试点 5 <-- 关键检查点
      await fetchBooks();
      console.log("6. fetchBooks finished. Data should be refreshed."); // 调试点 6

    } catch (error) {
      console.error("Error caught in handleDelete for bookId:", bookId, "Error:", error); // 调试点 7
      message.error('删除失败');
    }
  };

  // const handleModalOk = async () => {
  //   try {
  //     // console.log("here");
  //     setIsModalVisible(false);
  //     const values = await form.validateFields();
  //     if (editingBook) {
  //       console.log("editingBook",values);
  //       await updateBook(editingBook.id, values);
  //       await fetchBooks();
  //       message.success('更新成功');
  //     } else {
  //       await addBook(values);
  //       message.success('添加成功');
  //     }
  //     // setIsModalVisible(false);
  //     // console.log("finish update");
  //   } catch (error) {
  //     message.error('操作失败');
  //   }
  // };
const handleModalOk = async () => {
  try {
    console.log("1. handleModalOk started"); // 调试点 1
    setIsModalVisible(false); // 这一步通常在验证前就执行，用户体验会好一点
    
    console.log("2. Attempting to validate fields..."); // 调试点 2
    const values = await form.validateFields();
    console.log("3. Fields validated successfully. Values:", values); // 调试点 3

    if (editingBook) {
      console.log("4. Editing mode. Calling updateBook..."); // 调试点 4a
      await updateBook(editingBook.id, values);
      console.log("5. updateBook finished."); // 调试点 5a
      message.success('更新成功');
    } else {
      console.log("4. Add mode. Calling addBook..."); // 调试点 4b
      await addBook(values);
      console.log("5. addBook finished."); // 调试点 5b
      message.success('添加成功');
    }

    console.log("6. Calling fetchBooks..."); // 调试点 6 <-- 关键检查点
    await fetchBooks();
    console.log("7. fetchBooks finished."); // 调试点 7

  } catch (error) {
    console.error("Error caught in handleModalOk:", error); // 调试点 8
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