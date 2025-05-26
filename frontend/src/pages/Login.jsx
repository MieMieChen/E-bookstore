import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Typography, message, ConfigProvider } from 'antd';
import { customTheme } from '../theme/themeConfigs';
import '../css/global.css';
import useMessage from "antd/es/message/useMessage";
import { useAuth} from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
// import {login} from '../services/login';
const { Title } = Typography;

function Login() {
  // const {userData,  changeUserData } = useShop();

  const [error, setError] = useState('');
  const [messageApi, contextHolder] = useMessage();
  const {login,getUser} = useAuth();
  const navigate = useNavigate();
    const onSubmit = async (values) => {
      let username = values['username'];
      let password = values['password'];
        let res = await login(username, password);
        console.log("res.ok", res.ok);
        if (res.ok) {
          console.log("登录成功", res.data);
          console.log("res.data.id", res.data.id);
          // changeUserData ({username: res.data.username, userid: res.data.id,address: res.data.address, phone: res.data.phone, email: res.data.email});
          const userData = await getUser();
          navigate('/home', { replace: true });
        }
        else
        {
           messageApi.error("无权访问当前页面，请先登录！", 0.6)
                    .then(() => navigate("/login"));
        }
    };


  return (
    <ConfigProvider theme={customTheme}>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(rgba(103, 58, 183, 0.7), rgba(103, 58, 183, 0.3))',
        backgroundImage: 'url(https://source.unsplash.com/random/1920x1080/?library,books)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      }}>
        <Card style={{
          width: 400,
          padding: 24,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: 8
        }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 24, color: '#673ab7' }}>
            网上书城
          </Title>
          
          <Form onFinish={onSubmit}>
            {error && (
              <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>
            )}
            
            <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
              <Input 
                placeholder="用户名" 
                // value={userData.username}
                // onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Item>
            
            <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password 
                placeholder="密码"
                // value={userData.password}
                // onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            
            <Button 
              type="primary" 
              htmlType="submit" 
              block
              style={{ height: 40, fontSize: 16 }}
            >
              登录
            </Button>
          </Form>
        </Card>
      </div>
    </ConfigProvider>
  );
}

export default Login;