import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/global.css';
import App from './App.jsx';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

//strictMode可以重复调用渲染的模块 检查是否是纯函数 是否存在·副作用 