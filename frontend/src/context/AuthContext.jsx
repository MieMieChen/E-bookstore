import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserInfo, updateUserInfo } from '../services/user';
import { login as loginApi } from '../services/login';
import { getMe as getMeApi } from '../services/auth';
import Cookies from 'js-cookie';

//localStorage 是浏览器内置的 Web Storage API，不需要额外声明
// 它是前端本地存储机制，用于在浏览器中持久化存储键值对数据
// 数据会一直保存在浏览器中，除非被明确删除或清除浏览器缓存
// 存储的数据只能是字符串，所以需要使用 JSON.stringify() 和 JSON.parse()


const AuthContext = createContext();
const COOKIE_NAME = 'currentUser';
const COOKIE_OPTIONS = {
  path: '/',
  secure: process.env.NODE_ENV === 'production', // Use secure in production
  sameSite: 'strict'
};

// 解码 Base64 cookie 值
const decodeCookie = (cookieValue) => {
  try {
    if (!cookieValue) return null;
    const decoded = atob(cookieValue);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to decode cookie:', error);
    return null;
  }
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // 在组件挂载时验证用户状态
    const validateUser = async () => {
      const userData = await getMeApi();
      if (userData) {
        setCurrentUser(userData);
      } else {
        setCurrentUser(null);
        Cookies.remove(COOKIE_NAME, { path: '/' });
      }
      setLoading(false);
    };
    validateUser();
  }, []);
  
  // 登录后加载完整的用户信息
  const refreshUserInfo = async (userId) => {
    try {
      const fullUserInfo = await getUserInfo(userId);
      // 更新currentUser但保留之前的认证信息
      setCurrentUser(prev => {
        const updatedUser = { ...prev, ...fullUserInfo };
        // 更新cookie
        Cookies.set(COOKIE_NAME, btoa(JSON.stringify(updatedUser)), COOKIE_OPTIONS);
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
      const response = await loginApi(username, password);
      console.log('登录响应:', response);
      if (!response.ok) {
        throw new Error(response.message || '登录失败');
      }
      
      const userData = response.data;
      setCurrentUser(userData);
      
      // 登录后加载完整的用户信息
      console.log(userData.id);
      await refreshUserInfo(userData.id);
      return response;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  };
  
  // 登出函数
  const logout = () => {
    setCurrentUser(null);
    Cookies.remove(COOKIE_NAME, { path: '/' });
  };
  
  // 检查用户是否已认证
  const isAuthenticated = () => {
    return currentUser !== null;
  };
  
  // 获取当前用户数据
  const getUser = async(userId) => {
    if (currentUser) return currentUser;
    
    const savedUser = Cookies.get(COOKIE_NAME);
    if (savedUser) {
      try {
        const userData = decodeCookie(savedUser);
        if (userData) {
          setCurrentUser(userData);
          return userData;
        }
      } catch (error) {
        console.error('Failed to parse user data from cookie:', error);
        Cookies.remove(COOKIE_NAME);
        return null;
      }
    }
    else
    {
      const User = await getUserInfo(userId);
      return User;
    }
  };
  
  // 更新用户信息
  const updateUser = async (userData) => {
    try {
      if (!currentUser || !currentUser.id) {
        throw new Error('未登录，无法更新用户信息');
      }
      
      // 调用API更新用户信息
      const updatedUser = await updateUserInfo(currentUser.id, userData);
      
      // 更新状态和cookie
      setCurrentUser(prev => {
        const newUserData = { ...prev, ...updatedUser };
        Cookies.set(COOKIE_NAME, btoa(JSON.stringify(newUserData)), COOKIE_OPTIONS);
        return newUserData;
      });
      
      return updatedUser;
    } catch (error) {
      console.error('更新用户信息失败:', error);
      throw error;
    }
  };
  
  // 获取当前用户信息
  const getMe = async () => {
    try {
      const userData = await getMeApi();
      if (userData) {
        setCurrentUser(userData);
        return userData;
      }
      return null;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      setCurrentUser(null);
      Cookies.remove(COOKIE_NAME, { path: '/' });
      return null;
    }
  };
  
  const value = {
    currentUser,
    loading,
    login,
    logout,
    getUser,
    getMe,
    isAuthenticated,
    refreshUserInfo,
    updateUser
  };
  // Provider 组件接收一个 value prop，这个 value 就是您希望向下传递的数据
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 