import React, { useState } from 'react';
import { Card, Avatar, Typography, Descriptions, Divider, Button, Row, Col, Input, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
import UserProfile from '../components/user_profile';  
function Profile() {
  return (
    <div style={{ 
      height: '100%',
      overflow: 'visible',
      padding: '24px'
    }}>
      <Title level={2}>个人信息</Title>
      <Divider />
      <UserProfile />
    </div>
  );
}

export default Profile; 