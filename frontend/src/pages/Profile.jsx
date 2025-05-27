import React, { useState } from 'react';
import {Typography, Divider} from 'antd';
import { useNavigate } from "react-router-dom";
const { Title} = Typography;
import UserProfile from '../components/user_profile';  
import useMessage from "antd/es/message/useMessage";
import { getUserInfo } from '../services/user';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export function Profile() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
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
