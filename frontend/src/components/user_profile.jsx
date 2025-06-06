import React, { useState, useEffect } from 'react';
import { Card, Avatar, Typography, Descriptions, Divider, Button, Row, Col, Input, message, Spin } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, EditOutlined, SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  
  // 获取认证上下文
  const { currentUser, getMe, updateUser } = useAuth();

  // 组件加载时获取最新用户信息
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const me = await getMe();
        if (me) {
          setUserData(me);
        }
      } catch (error) {
        console.error('加载用户信息失败:', error);
        message.error('加载用户信息失败');
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, []);

  // 临时存储编辑中的数据
  const [tempData, setTempData] = useState({
    email: '',
    phone: '',
    address: ''
  });

  // 当用户信息更新时，更新临时数据
  useEffect(() => {
    if (userData) {
      setTempData({
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || ''
      });
    }
  }, [userData]);

  // 处理输入变化
  const handleInputChange = (field, value) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 保存更改到后端
  const handleSave = async () => {
    setLoading(true);
    try {
      // 调用后端API更新用户信息
      const updatedUser = await updateUser(tempData);
      setUserData(updatedUser);
      setIsEditing(false);
      message.success('个人信息更新成功！');
    } catch (error) {
      console.error('更新用户信息失败:', error);
      message.error('更新个人信息失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 取消编辑
  const handleCancel = () => {
    // 恢复为原始数据
    setTempData({
      email: userData?.email || '',
      phone: userData?.phone || '',
      address: userData?.address || ''
    });
    setIsEditing(false);
  };

  // 刷新用户信息
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const me = await getMe();
      if (me) {
        setUserData(me);
        message.success('用户信息已刷新');
      }
    } catch (error) {
      console.error('刷新用户信息失败:', error);
      message.error('刷新用户信息失败');
    } finally {
      setLoading(false);
    }
  };

  // 如果正在加载，显示加载指示器
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  if (!userData) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Text type="secondary">未能加载用户信息</Text>
      </div>
    );
  }

  return (
    <Row gutter={24}>
      <Col xs={24} sm={24} md={8}>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <Avatar size={120} icon={<UserOutlined />} />
            <Title level={3} style={{ marginTop: 16 }}>
              {userData.username}
            </Title>
            <Text type="secondary">ID: {userData.id}</Text>
            <Divider />
            <Button 
              icon={<ReloadOutlined />} 
              style={{ marginBottom: 16 }}
              onClick={handleRefresh}
            >
              刷新用户信息
            </Button>
            <Divider />
            {!isEditing ? (
              <Button type="primary" block onClick={() => setIsEditing(true)} icon={<EditOutlined />}>
                编辑资料
              </Button>
            ) : (
              <div>
                <Button type="primary" block onClick={handleSave} icon={<SaveOutlined />} style={{ marginBottom: 8 }}>
                  保存更改
                </Button>
                <Button block onClick={handleCancel}>
                  取消
                </Button>
              </div>
            )}
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={24} md={16}>
        <Card title="详细信息">
          <Descriptions bordered column={1}>
            <Descriptions.Item label="用户名">
              {userData.username}
            </Descriptions.Item>
            <Descriptions.Item label="邮箱">
              {isEditing ? (
                <Input 
                  prefix={<MailOutlined />}
                  value={tempData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="请输入邮箱"
                />
              ) : (
                <>
                  <MailOutlined style={{ marginRight: 8 }} />
                  {userData.email || '未设置'}
                </>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="手机号">
              {isEditing ? (
                <Input 
                  prefix={<PhoneOutlined />}
                  value={tempData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="请输入手机号"
                />
              ) : (
                <>
                  <PhoneOutlined style={{ marginRight: 8 }} />
                  {userData.phone || '未设置'}
                </>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="地址">
              {isEditing ? (
                <Input 
                  prefix={<EnvironmentOutlined />}
                  value={tempData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="请输入地址"
                />
              ) : (
                <>
                  <EnvironmentOutlined style={{ marginRight: 8 }} />
                  {userData.address || '未设置'}
                </>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="账户余额">
              ¥{userData.cash || 0}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>
    </Row>
  );
}