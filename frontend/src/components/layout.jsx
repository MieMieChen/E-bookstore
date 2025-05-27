import React from 'react';
import { useEffect } from "react";
import { Layout, Menu, Avatar, Typography, theme } from 'antd';
import { Link, useLocation, Outlet, useNavigate, Navigate } from 'react-router-dom';
import { 
  HomeOutlined, 
  ShoppingCartOutlined, 
  OrderedListOutlined,
  UserOutlined,
  BookOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import useMessage from "antd/es/message/useMessage";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

export function MainLayout() {
  const location = useLocation();
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = useMessage();
  const { currentUser, getUser, updateUser, isAuthenticated, getMe } = useAuth();

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

  useEffect(() => {
    const checkLogin = async () => {
      if (!isAuthenticated) {
        return;
      }
      try {
        const me = await getMe();
        if (!me) {
          messageApi.error("登录已过期，请重新登录！", 0.6)
            .then(() => navigate("/login"));
        } else {
          updateUser(me);
        }
      } catch (error) {
        console.error("验证用户失败:", error);
        messageApi.error("验证用户信息失败，请重新登录！", 0.6)
          .then(() => navigate("/login"));
      }
    };
    checkLogin();
  }, [isAuthenticated]); // 只在认证状态变化时检查

  // 如果未认证，直接重定向到登录页
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <Layout style={{ width: '100%', minHeight: '100vh' }}>   
      {contextHolder}
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 32px'
      }}>
        <BookOutlined style={{ fontSize: 24, color: 'white', marginRight: 12 }} />
        <Title level={2} style={{ margin: 0, color: 'white' }}>
          书城
        </Title>
      </Header>
      <Layout>
        <Sider width={220} >
          <div style={{ 
            padding: '24px 0', 
            textAlign: 'center',
            marginBottom: 10
          }}>
            <Avatar size={80} icon={<UserOutlined />} />
            <Title level={6} style={{ marginTop: 12, marginBottom: 4 }}>
              欢迎 {currentUser?.username}
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