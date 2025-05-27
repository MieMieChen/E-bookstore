import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Form, Input, Button, Typography, Space, message } from 'antd';
import { register } from '../services/auth';
import { customTheme } from '../theme/themeConfigs';
import { ConfigProvider } from 'antd';
const { Title } = Typography;

export function Register() {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const onSubmit = async (values) => {
        try {
            // 验证两次密码是否一致
            if (values.password !== values.confirmPassword) {
                message.error('两次输入的密码不一致！');
                return;
            }

            // 构造注册数据
            const userData = {
                username: values.username,
                password: values.password,
                email: values.email
            };

            const result = await register(userData);
            
            if (result.ok) {
                message.success(result.message).then(() => {
                    navigate('/login');  // 注册成功后跳转到登录页
                });
            } else {
                message.error(result.message);
            }
        } catch (error) {
            message.error('注册过程中发生错误，请稍后重试');
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
                        注册账号
                    </Title>
                    
                    <Form
                        form={form}
                        onFinish={onSubmit}
                        layout="vertical"
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                { required: true, message: '请输入用户名' },
                                { min: 3, message: '用户名至少3个字符' }
                            ]}
                        >
                            <Input placeholder="用户名" />
                        </Form.Item>
                        
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: '请输入邮箱' },
                                { type: 'email', message: '请输入有效的邮箱地址' }
                            ]}
                        >
                            <Input placeholder="邮箱" />
                        </Form.Item>
                        
                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: '请输入密码' },
                                { min: 6, message: '密码至少6个字符' }
                            ]}
                        >
                            <Input.Password placeholder="密码" />
                        </Form.Item>
                        
                        <Form.Item
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
                            <Input.Password placeholder="确认密码" />
                        </Form.Item>
                        
                        <Form.Item>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                block
                                style={{ height: 40, fontSize: 16 }}
                            >
                                注册
                            </Button>
                        </Form.Item>

                        <div style={{ textAlign: 'center' }}>
                            已有账号？ <Link to="/login">立即登录</Link>
                        </div>
                    </Form>
                </Card>
            </div>
        </ConfigProvider>
    );
} 