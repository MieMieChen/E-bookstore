import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Input, Select, Button, Typography, Space, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { getBooks, searchBooks } from '../services/book';
import '../css/global.css';

const { Search } = Input;
const { Option } = Select;

export default function Home() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchType, setSearchType] = useState('title');
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  // 使用useEffect来处理搜索逻辑
  useEffect(() => {
    const performSearch = async () => {
      if (!searchValue) {
        setFilteredBooks(books);
        return;
      }
      
      try {
        setLoading(true);
        const data = await searchBooks(searchType, searchValue);
        setFilteredBooks(data);
      } catch (error) {
        message.error('搜索图书失败');
        setFilteredBooks(books);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [searchValue, searchType, books]);

  const fetchBooks = async () => {
    try {
      const data = await getBooks();
      setBooks(data);
      setFilteredBooks(data);
      setLoading(false);
    } catch (error) {
      message.error('获取图书列表失败');
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const handleSearchTypeChange = (value) => {
    setSearchType(value);
  };

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <div className="home-container" style={{ padding: '24px' }}>
      <div className="search-section" style={{ marginBottom: '24px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Typography.Title level={2}>图书搜索</Typography.Title>
          <Space>
            <Select
              defaultValue="title"
              style={{ width: 120 }}
              onChange={handleSearchTypeChange}
            >
              <Option value="title">书名</Option>
              <Option value="author">作者</Option>
              <Option value="isbn">ISBN</Option>
            </Select>
            <Search
              placeholder="请输入搜索内容"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              style={{ width: 300 }}
              loading={loading}
            />
          </Space>
        </Space>
      </div>

      <Row gutter={[24, 24]} className="book-list">
        {filteredBooks.map((book) => (
          <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
            <Card
              hoverable
              style={{ height: '100%' }}
              bodyStyle={{ padding: '12px' }}
              cover={
                <div style={{ 
                  height: '200px', 
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5'
                }}>
                  <img 
                    alt={book.title} 
                    src={book.imageUrl} 
                    style={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }} 
                  />
                </div>
              }
              onClick={() => handleBookClick(book.id)}
            >
              <Card.Meta
                title={
                  <Typography.Title level={5} style={{ margin: 0, height: '48px', overflow: 'hidden' }}>
                    {book.title}
                  </Typography.Title>
                }
                description={
                  <div style={{ height: '80px' }}>
                    <p style={{ margin: '4px 0' }}>作者：{book.author}</p>
                    <p style={{ margin: '4px 0' }}>价格：¥{book.price}</p>
                    <p style={{ margin: '4px 0' }}>库存：{book.stock}</p>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

