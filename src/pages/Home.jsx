import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Input, Select, Button, Typography, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { books } from '../data/books';
import '../css/global.css';  
const { Search } = Input;
const { Option } = Select;

export default function Home() {
  const [filteredBooks, setFilteredBooks] = useState(books);
  const [searchType, setSearchType] = useState('title');
  const navigate = useNavigate();

  const handleSearch = (searchType, query) => {
    if (!query) {
      setFilteredBooks(books);
      return;
    }
    const searchValue = query.toLowerCase();
    const filtered = books.filter((book) => {
      switch (searchType) {
        case 'title':
          return book.title.toLowerCase().includes(searchValue);
        case 'author':
          return book.author.toLowerCase().includes(searchValue);
        case 'isbn':
          return book.isbn.includes(searchValue);
        default:
          return true;
      }
    });
    setFilteredBooks(filtered);
  };

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <div>
      <Typography.Title level={1}>书籍列表</Typography.Title>
      
      <Space style={{ marginBottom: 24, width: '100%' }}>
        <Select 
          defaultValue="title" 
          onChange={(value) => setSearchType(value)}
          style={{ width: 120 }}
        >
          <Option value="title">书名</Option>
          <Option value="author">作者</Option>
          <Option value="isbn">ISBN</Option>
        </Select>
        <Search 
          placeholder="搜索书籍" 
          allowClear
          // enterButton={<SearchOutlined />}
          onSearch={(value) => handleSearch(searchType, value)}
          style={{ width: 400 ,   colorRendering:'rgb(12, 9, 227)',}}
        />
      </Space>
      
      <Row gutter={[24, 24]}> 
        {filteredBooks.map((book) => (
          <Col key={book.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={<img alt={book.title} src={book.cover} style={{ height: 250, objectFit: 'cover' }} />}
              onClick={() => handleBookClick(book.id)}
              bodyStyle={{ padding: 16 }}
            >
              <Typography.Title level={5} ellipsis={{ rows: 1 }}>
                {book.title}
              </Typography.Title>
              <Typography.Text type="secondary">{book.author}</Typography.Text>
              <Typography.Text strong style={{ display: 'block', marginTop: 8 }}>
                ¥{book.price}
              </Typography.Text>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

