import React from 'react';
import { Layout, Menu, Avatar, Typography, theme } from 'antd';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  HomeOutlined, 
  ShoppingCartOutlined, 
  OrderedListOutlined,
  UserOutlined,
  BookOutlined
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

function MainLayout() {
  const location = useLocation();
  const { token } = theme.useToken();

  // 菜单项配置
  const menuItems = [
    {
      key: '/home',
      icon: <HomeOutlined />,
      label: <Link to="/home">首页</Link>,
    },
    {
      key: '/cart',
      icon: <ShoppingCartOutlined />,
      label: <Link to="/cart">购物车</Link>,
    },
    {
      key: '/orders',
      icon: <OrderedListOutlined />,
      label: <Link to="/orders">我的订单</Link>,
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: <Link to="/profile">个人信息</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        background: token.colorPrimary,
        padding: '0 24px'
      }}>
        <BookOutlined style={{ fontSize: 24, color: 'white', marginRight: 12 }} />
        <Title level={3} style={{ margin: 0, color: 'white' }}>
          书城
        </Title>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: token.colorBgContainer }}>
          <div style={{ 
            padding: '24px 0', 
            textAlign: 'center',
            borderBottom: `1px solid ${token.colorBorder}`,
            marginBottom: 16
          }}>
            <Avatar size={64} icon={<UserOutlined />} />
            <Title level={5} style={{ marginTop: 12, marginBottom: 4 }}>
              欢迎, reins
            </Title>
            <Text type="secondary">书城会员</Text>
          </div>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: token.colorBgContainer,
              borderRadius: token.borderRadius,
              marginTop: 24,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default MainLayout; 