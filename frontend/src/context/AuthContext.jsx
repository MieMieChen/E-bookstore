import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserInfo, updateUserInfo } from '../services/user';
import { login as loginApi } from '../services/login';
import { getMe as getMeApi } from '../services/auth';
import { register as registerApi } from '../services/auth';//localStorage 是浏览器内置的 Web Storage API，不需要额外声明
import crypto from 'crypto-js';


// 它是前端本地存储机制，用于在浏览器中持久化存储键值对数据
// 数据会一直保存在浏览器中，除非被明确删除或清除浏览器缓存
// 存储的数据只能是字符串，所以需要使用 JSON.stringify() 和 JSON.parse()


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // 在组件挂载时验证用户状态
    const validateUser = async () => {
      const userData = await getMeApi();
      setCurrentUser(userData || null);
      setLoading(false);
    };
    validateUser();
  }, []);
  
  // 登录函数
  const login = async (username, password) => {
      // 直接发送原始密码，让后端处理加密
      const response = await loginApi(username, password);
      if (response.ok && response.data) {
          setCurrentUser(response.data);
      }
      return response;
  };
  
  // 登出函数
  const logout = () => {
    setCurrentUser(null);
  };
  
  // 检查用户是否已认证
  const isAuthenticated = () => {
    return currentUser !== null;
  };
  
  // 获取当前用户信息
  const getMe = async () => {
    try {
      const userData = await getMeApi();
      if (userData) {
        setCurrentUser(prev => {
          if (!prev || prev.id !== userData.id) {
            return userData;
          }
          return prev;
        });
        return userData;
      }
      setCurrentUser(null);
      return null;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      setCurrentUser(null);
      return null;
    }
  };
  
  // 更新用户信息
  const updateUser = async (userData) => {
    try {
      const updatedUser = await updateUserInfo(userData);
      setCurrentUser(prev => ({ ...prev, ...updatedUser }));
      return updatedUser;
    } catch (error) {
      console.error('更新用户信息失败:', error);
      throw error;
    }
  };
  const register = async (username, email, password, address, phone) => {
    try {
      const userData = {
        username,
        email,
        password,
        address: address || '',
        phone: phone || ''
      };
      console.log("Registering with data:", userData);
      const response = await registerApi(userData);
      
      if (!response.ok) {
        throw new Error(response.message || '注册失败');
      }
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      return {
        ok: false,
        message: error.message || '注册失败，请稍后重试'
      };
    }
  };


  const value = {
    currentUser,
    loading,
    login,
    logout,
    getMe,
    isAuthenticated,
    updateUser,
    register
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 