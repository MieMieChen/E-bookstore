import React from 'react';
import { Card, Avatar, Typography, Descriptions, Divider, Button, Row, Col } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function Profile() {
  // 模拟用户数据
  const userData = {
    username: 'reins',
    name: '李明',
    email: 'liming@example.com',
    phone: '138****1234',
    address: '上海市闵行区东川路800号',
    memberSince: '2023-01-15',
    memberLevel: '黄金会员',
    points: 2500
  };

  return (
    <div>
      <Title level={2}>个人信息</Title>
      <Divider />
      
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
              <Button type="primary" block>
                编辑资料
              </Button>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={24} md={16}>
          <Card title="详细信息">
            <Descriptions bordered column={1}>
              <Descriptions.Item label="用户名">{userData.username}</Descriptions.Item>
              <Descriptions.Item label="姓名">{userData.name}</Descriptions.Item>
              <Descriptions.Item label="邮箱">
                <MailOutlined style={{ marginRight: 8 }} />
                {userData.email}
              </Descriptions.Item>
              <Descriptions.Item label="手机号">
                <PhoneOutlined style={{ marginRight: 8 }} />
                {userData.phone}
              </Descriptions.Item>
              <Descriptions.Item label="地址">
                <EnvironmentOutlined style={{ marginRight: 8 }} />
                {userData.address}
              </Descriptions.Item>
              <Descriptions.Item label="会员等级">{userData.memberLevel}</Descriptions.Item>
              <Descriptions.Item label="会员积分">{userData.points}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Profile; 