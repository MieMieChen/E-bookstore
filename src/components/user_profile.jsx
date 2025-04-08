import React, { useState } from 'react';
import { Card, Avatar, Typography, Descriptions, Divider, Button, Row, Col, Input, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { useShop } from '../context/ShopContext';
const { Title, Text } = Typography;

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  
  // 用户数据
  // const [userData, setUserData] = useState({
  //   username: 'Ashely',
  //   name: '屁大点事分享家',
  //   email: 'ashley@example.com',
  //   phone: '123****4567',
  //   address: '最温暖的被窝',
  //   memberSince: '520-1314',
  //   memberLevel: 'VVVVVVVVVVVVVVIP',
  //   points: 771995
  // });
  const{userData,changeUserData} = useShop();
  // 临时存储编辑中的数据
  const [tempData, setTempData] = useState({ ...userData });

  // 处理输入变化
  const handleInputChange = (field, value) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 保存更改
  const handleSave = () => {
    changeUserData(tempData);
    setIsEditing(false);
    message.success('个人信息更新成功！');
  };

  // 取消编辑
  const handleCancel = () => {
    setTempData({ ...userData });
    setIsEditing(false);
  };

  return (
    <Row gutter={24}>
      <Col xs={24} sm={24} md={8}>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <Avatar size={120} icon={<UserOutlined />} />
            <Title level={3} style={{ marginTop: 16 }}>
              {userData.name}
            </Title>
            <Text type="secondary">@{userData.username}</Text>
            <Divider />
            <Text strong>{userData.memberLevel}</Text>
            <br />
            <Text>积分: {userData.points}</Text>
            <br />
            <Text type="secondary">注册时间: {userData.memberSince}</Text>
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
              {isEditing ? (
                <Input 
                  value={tempData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                />
              ) : (
                userData.username
              )}
            </Descriptions.Item>
            <Descriptions.Item label="姓名">
              {isEditing ? (
                <Input 
                  value={tempData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              ) : (
                userData.name
              )}
            </Descriptions.Item>
            <Descriptions.Item label="邮箱">
              {isEditing ? (
                <Input 
                  prefix={<MailOutlined />}
                  value={tempData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              ) : (
                <>
                  <MailOutlined style={{ marginRight: 8 }} />
                  {userData.email}
                </>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="手机号">
              {isEditing ? (
                <Input 
                  prefix={<PhoneOutlined />}
                  value={tempData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              ) : (
                <>
                  <PhoneOutlined style={{ marginRight: 8 }} />
                  {userData.phone}
                </>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="地址">
              {isEditing ? (
                <Input 
                  prefix={<EnvironmentOutlined />}
                  value={tempData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              ) : (
                <>
                  <EnvironmentOutlined style={{ marginRight: 8 }} />
                  {userData.address}
                </>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="会员等级">{userData.memberLevel}</Descriptions.Item>
            <Descriptions.Item label="会员积分">{userData.points}</Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>
    </Row>
  );
}