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

//ConfigProvider 是许多 UI 组件库（如 Ant Design、React Suite 等）提供的一个顶层配置组件，用于统一管理子组件的全局默认参数、语言包、主题样式等。它通过 React 的 Context API 实现跨层级数据传递，避免在每个组件中重复配置。


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

