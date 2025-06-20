import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Form, Input, Button, Typography, ConfigProvider, message } from 'antd';
import { customTheme } from '../theme/themeConfigs';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

export function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const onSubmit = async (values) => {
        try {
            if (values.password !== values.confirmPassword) {
                message.error('两次输入的密码不一致！');
                return;
            }

            const result = await register(
                values.username,
                values.email,
                values.password,
                values.address || '',
                values.phone || ''
            );

            if (result.ok) {
                message.success('注册成功！');
                navigate('/login');
            } else {
                message.error(result.message || '注册失败，请重试');
            }
        } catch (error) {
            console.error('Registration error:', error);
            message.error(error.message || '注册过程中发生错误，请重试');
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
                        用户注册
                    </Title>
                    
                    <Form onFinish={onSubmit} layout="vertical">
                        <Form.Item
                            label="用户名"
                            name="username"
                            rules={[
                                { required: true, message: '请输入用户名' },
                                { min: 3, message: '用户名至少3个字符' }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="邮箱"
                            name="email"
                            rules={[
                                { required: true, message: '请输入邮箱' },
                                { type: 'email', message: '请输入有效的邮箱地址' }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="密码"
                            name="password"
                            rules={[
                                { required: true, message: '请输入密码' },
                                { min: 6, message: '密码至少6个字符' }
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="确认密码"
                            name="confirmPassword"
                            rules={[
                                { required: true, message: '请确认密码' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('两次输入的密码不一致！'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="地址"
                            name="address"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="电话"
                            name="phone"
                            rules={[
                                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            block
                            style={{ height: 40, fontSize: 16 }}
                        >
                            注册
                        </Button>

                        <div style={{ marginTop: 16, textAlign: 'center' }}>
                            <Link to="/login" style={{ color: '#673ab7' }}>
                                已有账号？返回登录
                            </Link>
                        </div>
                    </Form>
                </Card>
            </div>
        </ConfigProvider>
    );
} 