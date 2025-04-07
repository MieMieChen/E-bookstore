import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Typography, message, ConfigProvider } from 'antd';
import { customTheme } from '../theme/themeConfigs';
import '../css/global.css';

const { Title } = Typography;

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === 'reins' && password === '123456') {
      navigate('/home');
    } else {
      setError('用户名或密码错误');
      message.error('用户名或密码错误');
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
          
          <Form onFinish={handleLogin}>
            {error && (
              <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>
            )}
            
            <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
              <Input 
                placeholder="用户名" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Item>
            
            <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password 
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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