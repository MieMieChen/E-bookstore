import React, { useState } from 'react';
import {Typography, Divider} from 'antd';
import { useNavigate } from "react-router-dom";
const { Title} = Typography;
import UserProfile from '../components/user_profile';  
import useMessage from "antd/es/message/useMessage";
import { getUserInfo } from '../services/user';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PrivateLayout } from "../components/layout";

export function Profile() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [messageApi, contextHolder] = useMessage();
    const {currentUser} = useAuth(); 
    useEffect(() => {
            const checkLogin = async () => {
                if(!currentUser) {
                    messageApi.error("无权访问当前页面，请先登录！", 0.6)
                        .then(() => navigate("/login"));
                } else {
                    let me = await getUserInfo(currentUser.id);
                    if (!me) {
                        messageApi.error("无权访问当前页面，请先登录！", 0.6)
                        .then(() => navigate("/login"));
                } else {
                    setUser(me);
                }
            }
        }
        checkLogin();
    }, [navigate]);
        

  return (
    <PrivateLayout>
    
      <div style={{ 
        height: '100%',
        overflow: 'visible',
        padding: '24px'
      }}>
        <Title level={2}>个人信息</Title>
        <Divider />
        <UserProfile />
      </div>
    </PrivateLayout>
 ) ;
}
