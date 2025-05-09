import React, { useState, useEffect } from 'react';
import { Card, Avatar, Typography, Descriptions, Divider, Button, Row, Col, Input, message, Spin } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, EditOutlined, SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // 获取认证上下文
  const { currentUser, getUser, refreshUserInfo, updateUser } = useAuth();
  
  // 获取用户数据
  const user = currentUser || getUser();
  
  // 临时存储编辑中的数据
  const [tempData, setTempData] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  // 组件加载时获取最新用户信息
  useEffect(() => {
    const loadUserData = async () => {
      if (user && user.id) {
        setLoading(true);
        try {
          await refreshUserInfo(user.id);
        } catch (error) {
          console.error('加载用户信息失败:', error);
          message.error('加载用户信息失败');
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadUserData();
  }, []);

  // 当用户信息更新时，更新临时数据
  useEffect(() => {
    if (user) {
      setTempData({
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

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
      await updateUser(tempData);
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
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || ''
    });
    setIsEditing(false);
  };

  // 刷新用户信息
  const handleRefresh = async () => {
    if (user && user.id) {
      setLoading(true);
      try {
        await refreshUserInfo(user.id);
        message.success('用户信息已刷新');
      } catch (error) {
        console.error('刷新用户信息失败:', error);
        message.error('刷新用户信息失败');
      } finally {
        setLoading(false);
      }
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

  return (
    <Row gutter={24}>
      <Col xs={24} sm={24} md={8}>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <Avatar size={120} icon={<UserOutlined />} />
            <Title level={3} style={{ marginTop: 16 }}>
              {user.username}
            </Title>
            <Text type="secondary">ID: {user.id}</Text>
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
              {user.username}
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
                  {user.email || '未设置'}
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
                  {user.phone || '未设置'}
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
                  {user.address || '未设置'}
                </>
              )}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>
    </Row>
  );
}