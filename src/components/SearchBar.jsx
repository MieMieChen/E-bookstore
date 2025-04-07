import React from 'react';
import { Input, Select, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

function SearchBar({ onSearch }) {
  const [searchType, setSearchType] = React.useState('title');
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = () => {
    onSearch(searchType, searchQuery);
  };

  return (
    <Space.Compact style={{ width: '100%', maxWidth: 600, marginBottom: 24 }}>
      <Select 
        defaultValue="title"
        onChange={setSearchType}
        style={{ width: 120 }}
      >
        <Option value="title">书名</Option>
        <Option value="author">作者</Option>
        <Option value="isbn">ISBN</Option>
      </Select>
      <Search
        placeholder="搜索图书..."
        enterButton={<SearchOutlined />}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onSearch={handleSearch}
      />
    </Space.Compact>
  );
}

export default SearchBar;