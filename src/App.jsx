import React from 'react';
import { ConfigProvider } from 'antd';
import { customTheme } from './theme/themeConfigs';
import AppRouter from './components/router';
import './css/global.css';

function App() {
  return (
    <ConfigProvider theme={customTheme}>
      <AppRouter />
    </ConfigProvider>
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

