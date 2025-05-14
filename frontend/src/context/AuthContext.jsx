import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserInfo, updateUserInfo } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // 在组件挂载时，从localStorage检查用户登录状态
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);
  
  // 登录后加载完整的用户信息
  const refreshUserInfo = async (userId) => {
    try {
      const fullUserInfo = await getUserInfo(userId);
      // 更新currentUser但保留之前的认证信息
      setCurrentUser(prev => {
        const updatedUser = { ...prev, ...fullUserInfo };
        // 更新localStorage
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        return updatedUser;
      });
      return fullUserInfo;
    } catch (error) {
      console.error('刷新用户信息失败:', error);
      return null;
    }
  };
  
  // 登录函数
  const login = async (username, password) => {
    try {
      const userData = await loginApi(username, password);
      setCurrentUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      // 登录后加载完整的用户信息
      await refreshUserInfo(userData.id);
      return userData;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  };
  
  // 登出函数
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };
  
  // 检查用户是否已认证
  const isAuthenticated = () => {
    return currentUser !== null;
  };
  
  // 获取当前用户数据
  const getUser = () => {
    if (currentUser) return currentUser;
    
    // 从本地存储获取
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      // 异步更新状态但不等待
      setCurrentUser(userData);
      return userData;
    }
    
    // 默认测试用户（仅在开发环境使用）
    console.warn('使用默认测试用户，仅用于开发环境');
    return {
      id: 1,
      username: 'test_user',
      email: 'test@example.com'
    };
  };
  
  // 更新用户信息
  const updateUser = async (userData) => {
    try {
      if (!currentUser || !currentUser.id) {
        throw new Error('未登录，无法更新用户信息');
      }
      
      // 调用API更新用户信息
      const updatedUser = await updateUserInfo(currentUser.id, userData);
      
      // 更新状态和localStorage
      setCurrentUser(prev => {
        const newUserData = { ...prev, ...updatedUser };
        localStorage.setItem('currentUser', JSON.stringify(newUserData));
        return newUserData;
      });
      
      return updatedUser;
    } catch (error) {
      console.error('更新用户信息失败:', error);
      throw error;
    }
  };
  
  const value = {
    currentUser,
    loading,
    login,
    logout,
    getUser,
    isAuthenticated,
    refreshUserInfo,
    updateUser
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