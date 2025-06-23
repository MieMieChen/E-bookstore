import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
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
  const navigate = useNavigate(); //这是一个用于编程式导航的 hook 返回一个函数，可以用来实现页面跳转
  const location = useLocation(); // 这个 hook 返回当前 URL 的 location 对象

  const onSubmit = async (values) => {
    try {
      setError('');
      const username = values.username?.trim();
      const password = values.password;
      
      if (!username || !password) {
        setError('用户名和密码不能为空');
        return;
      }

      const res = await login(username, password);
      if (res.ok&&res.data.valid==1) {
        messageApi.success("登录成功！").then(() => {
          const from = location.state?.from || '/home';
          console.log('登录成功，即将重定向到:', from);
          navigate(from, { replace: true });
        });
      } else if(!res.ok&&res.data.valid==1) {
        console.log("登录失败，请检查用户名和密码");
        setError('登录失败，请检查用户名和密码');
        messageApi.error('登录失败，请检查用户名和密码');
      }
      else 
      {
        console.log("res.ok&&res.data.valid",res.ok, res.data.valid);

        console.log("您的账号已经被禁用");
        setError('您的账号已经被禁用');
        messageApi.error('您的账号已经被禁用');
      }
    } catch (error) {
      console.error("Login error:", error);
      setError('');
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

            <div style={{ 
              marginTop: 16, 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center' 
            }}>
              <Link to="/register" style={{ color: '#673ab7' }}>
                新账号？前往注册
              </Link>
              <Link to="/forgot-password" style={{ color: '#673ab7' }}>
                忘记密码？
              </Link>
            </div>
          </Form>
        </Card>
      </div>
    </ConfigProvider>
  );
}

