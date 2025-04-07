import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/global.css';  
import { Layout, Menu, Button, Space, Typography } from 'antd';
import { HomeOutlined, ShoppingCartOutlined, ProfileOutlined } from '@ant-design/icons';

const { Header } = Layout;

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 只有在 /login 和 /home 页面不显示 Home 按钮
  const shouldShowHomeIcon = !['/login', '/home'].includes(location.pathname);

  return (
    <Header style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Space>
        {shouldShowHomeIcon && (
          <Button 
            type="text" 
            icon={<HomeOutlined />} 
            onClick={() => navigate('/home')}
          />
        )}
        <Typography.Title level={4} style={{ color: 'white', margin: 0 }}>
          Book Store
        </Typography.Title>
      </Space>
      
      <Space>
        <Button type="text" icon={<ShoppingCartOutlined />} onClick={() => navigate('/cart')}>
          购物车
        </Button>
        <Button type="text" onClick={() => navigate('/orders')}>
          订单
        </Button>
        <Button type="text" icon={<ProfileOutlined />} onClick={() => navigate('/profile')}>
          我的账户
        </Button>
      </Space>
    </Header>
  );
}

export default Navbar;
