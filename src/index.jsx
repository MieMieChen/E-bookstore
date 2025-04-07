import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/global.css';
import App from './App.jsx';
// import reportWebVitals from './reportWebVitals';
// 这是整个 React 应用的入口点,它通过 ReactDOM.createRoot() 创建应用的根节点. 將App 组件渲染到 HTML 中 id 为 "root" 的元素中
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
