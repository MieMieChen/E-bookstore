import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { checkAuth, saveReturnUrl } from '../services/auth';
import { message } from 'antd';
import useMessage from "antd/es/message/useMessage";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export const PrivateRoute = ({ children }) => {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const [messageApi, contextHolder] = useMessage();
    const {currentUser,getMe,updateUser} = useAuth(); 
    useEffect(() => {
            const checkLogin = async () => {
                if(!currentUser) {
                    messageApi.error("无权访问当前页面，请先登录！", 0.6)
                        .then(() => navigate("/login"));
                } else {
                    let me = await getMe();
                    if (!me) {
                        messageApi.error("无权访问当前页面，请先登录！", 0.6)
                        .then(() => navigate("/login"));
                } else {
                    updateUser(me);
                }
            }
        }
        checkLogin();
    }, [navigate]);

    // 在检查过程中显示加载状态或空白
    if (isChecking) {
        return null; // 或者返回一个加载指示器
    }

    // 如果未认证，重定向到登录页面，并传递当前位置
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 如果已认证，渲染子组件
    return children;
}; 