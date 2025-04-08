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
    // const Navigate = createNavigate();
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