import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from '../pages/Login';
import Home from '../pages/Home';
import BookDetail from '../pages/BookDetail';
import Cart from '../pages/Cart';
import Orders from '../pages/Orders';
import Profile from '../pages/Profile';
import MainLayout from '../components/MainLayout';
import ShopProvider from '../context/ShopContext';
import NotFound from '../pages/NotFound';

export default function AppRouter() {
// 这样做的目的是让整个应用的所有组件都能访问到 Context 中提供的状态和方法。如果没有外嵌 <ShopProvider>，子组件中使用 useShop() 会报错。
    return (
        <ShopProvider>
            <BrowserRouter>
                <Routes>
                    {/* 根路径重定向到登录页 */}
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    <Route path="/login" element={<Login />} />
                    
                    {/* MainLayout 包裹的需要导航栏的页面 */}
                    <Route element={<MainLayout />}>
                        <Route path="/home" element={<Home />} />
                        <Route path="/book/:id" element={<BookDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>

                    {/* 404页面 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </ShopProvider>
    );
}



//element 属性是 Route 组件的一个关键属性，它指定了当路由匹配时要渲染的 React 组件。
