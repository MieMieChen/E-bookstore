import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Input, Select, Pagination, Typography, Space, message, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { searchBooks } from '../services/book';
import '../css/global.css';

const { Search } = Input;
const { Option } = Select;

export function BooksExhibition() {
  const [books, setBooks] = useState([]);
  const [searchType, setSearchType] = useState('title');
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // State for pagination, conforming to Ant Design's Pagination component
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15, // Changed to 15 to show 3 rows of 5
    total: 0,
  });

  // A single, unified useEffect for fetching data whenever search or pagination changes
  useEffect(() => {
    const fetchPaginatedBooks = async () => {
      setLoading(true);
      try {
        // We call a single API endpoint that handles both searching and pagination.
        // We assume the `searchBooks` service function has been updated to accept
        // pagination parameters and will call your new backend endpoint.
        // The backend is expected to return a Page object: { content: [], totalElements: ... }
        const result = await (
          searchType,
          searchValue,
          pagination.current,
          pagination.pageSize
        );

        // Filter out books that are not meant to be shown
        const visibleBooks = result.content.filter(book => book.onShow === 1);
        setBooks(visibleBooks);
        setPagination(prev => ({
          ...prev,
          total: result.totalElements,
        }));
      } catch (error) {
        message.error('获取图书列表失败');
      } finally {
        setLoading(false);
      }
    };

    fetchPaginatedBooks();
  }, [searchValue, searchType, pagination.current, pagination.pageSize]);

  const handleSearch = (value) => {
    // When a new search is performed, reset to the first page
    setPagination(prev => ({ ...prev, current: 1 }));
    setSearchValue(value);
  };

  const handleSearchTypeChange = (value) => {
    // Also reset to the first page when search type changes
    setPagination(prev => ({ ...prev, current: 1 }));
    setSearchType(value);
  };
  
  const handlePaginationChange = (page, pageSize) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: pageSize,
    });
  };

  const handleBookClick = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  // Chunk the books array into rows of 5
  const bookRows = [];
  for (let i = 0; i < books.length; i += 5) {
    bookRows.push(books.slice(i, i + 5));
  }

  return (
    <div className="home-container" style={{ padding: '24px' }}>
      <div className="search-section" style={{ marginBottom: '24px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Typography.Title level={2}>图书搜索</Typography.Title>
          <Search
            addonBefore={
              <Select
                value={searchType}
                style={{ width: 120 }}
                onChange={handleSearchTypeChange}
              >
                <Option value="title">书名</Option>
                <Option value="author">作者</Option>
                <Option value="isbn">ISBN</Option>
              </Select>
            }
            placeholder="请输入搜索内容"
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ width: 450 }}
            loading={loading}
          />
        </Space>
      </div>

      <Spin spinning={loading}>
        {bookRows.map((row, rowIndex) => (
          <Row key={rowIndex} gutter={[24, 24]} className="book-list" justify="center">
            {row.map((book) => (
              <Col xs={24} sm={12} md={8} lg={6} xl={4} key={book.id}>
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
        ))}
      </Spin>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={handlePaginationChange}
          showSizeChanger
        />
      </div>
    </div>
  );
}

