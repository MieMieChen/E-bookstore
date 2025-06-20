import React from 'react';
import { useEffect } from "react";
import { Layout, Menu, Avatar, Typography, theme } from 'antd';
import { Link, useLocation, Outlet, useNavigate, Navigate } from 'react-router-dom';
import { 
  HomeOutlined, 
  ShoppingCartOutlined, 
  OrderedListOutlined,
  UserOutlined,
  BookOutlined,
  BarChartOutlined
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
  const { currentUser, getMe, isAuthenticated } = useAuth();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const me = await getMe();
        if (!me) {
          console.log("请先登录！");
          messageApi.error("请先登录！", 0.6)
            .then(() => navigate("/login", { state: { from: location.pathname } }));
        }
      } catch (error) {
        console.error("验证用户失败:", error);
        messageApi.error("验证用户信息失败，请重新登录！", 0.6)
          .then(() => navigate("/login", { state: { from: location.pathname } })); //
      }
    };
    checkLogin();
  }, [location.pathname]); // 当路径变化时重新检查

  // 如果未认证，直接重定向到登录页
  if (!isAuthenticated()) {
      return <Navigate to="/login" replace state={{ from: location.pathname }} />; //通过 state 属性将这个路径传递给登录页面 replace 表示替换当前历史记录，而不是添加新记录
    }

    const AdminMenuItems =[
      {
        key: '/books',
        icon: <BookOutlined />,
        label: <Link to="/admin/books">书籍管理</Link>,
      },
      {
         key: '/orders',
        icon: <OrderedListOutlined />,
        label: <Link to="/admin/orders">订单管理</Link>,
      },
      {
        key:'/stats',
        icon: <BarChartOutlined />,
        label: <Link to="/admin/stats">统计分析</Link>,
      },
      {
        key:'/member',
        icon: <UserOutlined />,
        label:<Link to ="/admin/members">用户管理</Link>,
      },
      {
      key: '/profile',
      icon: <UserOutlined />,
      label: <Link to="/profile">个人信息</Link>,
    },
    ]
  const UserMenuItems = [
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
    {
      key:'/stats',
      icon: <BarChartOutlined />,
      label: <Link to="/user/stats">统计分析</Link>,
    },
  ];
  // currentUser.type = 1;
  // console.log ("当前用户信息:", currentUser.type);
  const menuItems = currentUser?.type ? AdminMenuItems : UserMenuItems;
  // const menuItems  = UserMenuItems;

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
            <Title level={4} style={{ marginTop: 12, marginBottom: 4 }}>
              欢迎 {currentUser?.username}
            </Title>
            <Text type="secondary">
              {currentUser?.type ? '管理员' : '书城会员'}</Text>
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