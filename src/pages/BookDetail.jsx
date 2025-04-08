import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Typography, Button, Divider, Tag, Card, Image, Space } from 'antd';
import { 
  ShoppingCartOutlined, 
  ShopOutlined, 
  CalendarOutlined,
  StockOutlined
} from '@ant-design/icons';
import { books } from '../data/books';
import { useShop } from '../context/ShopContext';
import '../css/global.css';
console.log('当前书籍数据:', books.map(b => ({ id: b.id, title: b.title })));

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useShop();
  const book = books.find((book) => {
    console.log('当前对比 ID:', book.id, typeof book.id); 
    console.log('路由参数 ID:', id, typeof id);
    return book.id == id;
  });

  if (!book) {
    return <div>图书不存在</div>;
  }

  const handleAddToCart = () => {
    addToCart(book);
    navigate('/cart');
  };

  const handleBuyNow = () => {
    addToCart(book);
    navigate('/orders');
  };

  return (
    <div>
      <Typography.Title level={1}>图书详情</Typography.Title>
      <Divider />
      
      <Card>
        <Row gutter={24}>
          <Col span={8}>
            <Image 
              src={book.cover} 
              alt={book.title}
              style={{ width: '100%', height: 'auto' }}
            />
          </Col>
          <Col span={16}>
            <Typography.Title level={2}>{book.title}</Typography.Title>
            <Typography.Title level={3} type="secondary">
              ¥{book.price.toFixed(2)}
            </Typography.Title>
            
            <div style={{ marginBottom: 16 }}>
              <Typography.Text>作者：{book.author}</Typography.Text>
              <Typography.Text>ISBN：{book.isbn}</Typography.Text>
              <Typography.Text>出版社：{book.publisher}</Typography.Text>
            </div>
            
            <Space size={[8, 16]} wrap>
              <Tag icon={<CalendarOutlined />}>出版日期：{book.publishDate}</Tag>
              <Tag 
                icon={<StockOutlined />}
                color={book.stock > 0 ? 'success' : 'error'}
              >
                库存：{book.stock}本
              </Tag>
            </Space>
            
            <Divider />
            
            <Space>
              <Button 
                type="default" 
                icon={<ShopOutlined />} 
                onClick={handleBuyNow}
              >
                立即购买
              </Button>
              <Button 
                type="primary" 
                icon={<ShoppingCartOutlined />} 
                onClick={handleAddToCart}
              >
                加入购物车
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default BookDetail;
