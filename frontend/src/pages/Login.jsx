import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Form, Input, Button, Typography, ConfigProvider } from 'antd';
import { customTheme } from '../theme/themeConfigs';
import '../css/global.css';
import useMessage from "antd/es/message/useMessage";
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

export function Login() {
  const [error, setError] = useState('');
  const [messageApi, contextHolder] = useMessage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (values) => {
    try {
      setError('');
      const username = values.username?.trim();
      const password = values.password;
      
      if (!username || !password) {
        setError('用户名和密码不能为空');
        return;
      }

      console.log('当前location状态:', {
        pathname: location.pathname,
        state: location.state,
        from: location.state?.from
      });

      const res = await login(username, password);

      if (res.ok) {
        messageApi.success("登录成功！").then(() => {
          const from = location.state?.from || '/home';
          console.log('登录成功，即将重定向到:', from);
          navigate(from, { replace: true });
        });
      } else {
        setError(res.message || '登录失败，请检查用户名和密码');
        messageApi.error(res.message || '登录失败，请检查用户名和密码');
      }
    } catch (error) {
      console.error("Login error:", error);
      setError('登录过程中发生错误，请稍后重试');
      messageApi.error('登录过程中发生错误，请稍后重试');
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
        {contextHolder}
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
            
            <Form.Item 
              name="username" 
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="用户名" />
            </Form.Item>
            
            <Form.Item 
              name="password" 
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="密码" />
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

