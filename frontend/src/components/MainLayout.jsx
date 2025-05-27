import React from 'react';
import { useEffect, useState } from "react";
import { Layout, Menu, Avatar, Typography, theme } from 'antd';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  HomeOutlined, 
  ShoppingCartOutlined, 
  OrderedListOutlined,
  UserOutlined,
  BookOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

  


function MainLayout({ children }) {
  const location = useLocation();
  const { token } = theme.useToken();
  // const {userData} = useShop();
  const { currentUser , isAuthenticated } = useAuth();
  // 菜单项配置 左侧的导航栏
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
//把这个删除 maxHeight: '100vh' 就能够自适应了~·
  return (
      <Layout style={{ width: '100%' }}>   
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
              {/* 欢迎, {user.username} */}
              欢迎 {currentUser.username}

            </Title>
            <Text type="secondary" style={{ fontSize: '25px' }} >书城会员</Text>
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
              backgroundAttachment: 'fixed',
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

export function PrivateLayout({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = useMessage();
  const location = useLocation();
  const { token } = theme.useToken();




  // 菜单项配置 左侧的导航栏
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
  
  const {currentUser,getUser,updateUser} = useAuth(); 
  useEffect(() => {
          const checkLogin = async () => {
              if(!currentUser) {
                  messageApi.error("无权访问当前页面，请先登录！", 0.6)
                      .then(() => navigate("/login"));
              } else {
                  let me = await getUser(currentUser.id);
                  if (!me) {
                      messageApi.error("无权访问当前页面，请先登录！", 0.6)
                      .then(() => navigate("/login"));
              } else {
                  updateUser(me);
              }
          }
      }
      checkLogin();
  }, [navigate]);
    return (
      <Layout style={{ width: '100%' }}>   
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
              {/* 欢迎, {user.username} */}
              欢迎 {currentUser.username}

            </Title>
            <Text type="secondary" style={{ fontSize: '25px' }} >书城会员</Text>
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
              backgroundAttachment: 'fixed',
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