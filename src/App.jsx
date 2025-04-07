import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Background from './components/Background';
import  ShopProvider  from './context/ShopContext';
import './css/global.css';
// 是整个应用的入口点
// 这是应用的根组件，所有其他组件都是它的子组件，包含了路由配置，决定了不同 URL 显示什么内容
// 在 React 中，组件是构建用户界面的基本单位。App 组件是整个应用的顶层组件，它：
// 作为其他所有组件的容器
// 管理全局的路由配置
// 可以包含全局的状态管理
// 可以设置全局的布局结构
// 在App.js当中使用ShopProvider，但其实是在'./context/ShopContext'当中定义的。
function App() {
  return (
    <ShopProvider> 
      <Router>
        <div className="App">
          <Background />
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </div>
      </Router>
    </ShopProvider>
  );
}

export default App;


// 用户访问网站
// ↓
// index.js 加载并渲染 App 组件
// ↓
// App 组件设置路由规则
// ↓
// 根据 URL 显示对应的页面：
// - / → 重定向到 /login
// - /login → 显示登录页面
// - /home → 显示首页（需要登录后才能访问）

