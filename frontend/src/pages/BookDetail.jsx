import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Divider, Spin, Alert } from 'antd';
import { useShop } from '../context/ShopContext';
import '../css/global.css';
import BookCard from '../components/bookCard';
import { getBookById } from '../services/book';

export function BookDetail() {
  //每次渲染组件，useParams 都会重新获取路由参数，确保获取的是最新的参数。
  // useState 的初始值仅首次渲染执行	React 会保留状态，只有 setBookPrice 触发时会重新渲染
  const { id } = useParams(); //
  const navigate = useNavigate();
  const { addToCart} = useShop();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);
        const bookData = await getBookById(id);
        if (!bookData) {
          throw new Error('图书不存在');
        }
        setBook(bookData);
      } catch (error) {
        console.error('获取图书详情失败:', error);
        setError(error.message || '获取图书详情失败');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(book);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert
          message="错误"
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (!book) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert
          message="提示"
          description="图书不存在"
          type="info"
          showIcon
        />
      </div>
    );
  }

  return (
    <div>
      <Typography.Title level={1}>图书详情</Typography.Title>
      <Divider />
      <BookCard 
        book={book}
        handleAddToCart={handleAddToCart}
      />
    </div>
  );
}

export default BookDetail;
