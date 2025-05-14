import React, { useState } from 'react';
import { Card, Avatar, Typography, Descriptions, Divider, Button, Row, Col, Input, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
const { Title, Text } = Typography;
import UserProfile from '../components/user_profile';  
import useMessage from "antd/es/message/useMessage";
import { getUserInfo } from '../services/api';
import { useEffect } from 'react';
function Profile() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [messageApi, contextHolder] = useMessage();
    useEffect(() => {
            const checkLogin = async () => {
                let me = await getUserInfo();
                if (!me) {
                    messageApi.error("无权访问当前页面，请先登录！", 0.6)
                        .then(() => navigate("/login"));
                } else {
                    setUser(me);
                }
            }
            checkLogin();
        }, [navigate]);

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
 ) ;
}

export default Profile; 