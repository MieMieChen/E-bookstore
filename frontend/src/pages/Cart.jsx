import React, { useEffect, useState, useCallback } from 'react';
import { Typography, Divider, Empty, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/cart_item';
import useMessage from "antd/es/message/useMessage";


const { Title } = Typography;

export function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated,getUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [lastCartHash, setLastCartHash] = useState('');
  const { 
    cartItems, 
    removeFromCart, 
    updateCartItemQuantity, 
    getCartTotal,
    createOrder,
    loadUserCart,
    // userData
  } = useShop();

  const {getMe} = useAuth();
  const [userC, setUserC] = useState(null);
  const [messageApi, contextHolder] = useMessage();
    useEffect(() => {
            const checkLogin = async () => {
                const userData = await getMe();
                console.log("userData", userData);
                let me = await getMe();
                console.log("me", me);
                if (!me) {
                    messageApi.error("无权访问当前页面，请先登录！", 0.6)
                        .then(() => navigate("/login"));
                } else {
                    setUserC(me);
                }
            }
            checkLogin();
        }, [navigate]);
  // 计算购物车内容的哈希值，用于比较购物车是否有变化
  const calculateCartHash = useCallback((items) => {
    return JSON.stringify(items.map(item => ({
      id: item.id,
      quantity: item.quantity
    })));
  }, []);

  useEffect(() => {
    const fetchCartData = async () => {
      if (isAuthenticated()) {
        setLoading(true);
        try {
          await loadUserCart();
          setLastCartHash(calculateCartHash(cartItems));
        } catch (error) {
          console.error('加载购物车失败:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchCartData();
    
    const intervalId = setInterval(() => {
      if (isAuthenticated()) {
        const checkCartUpdates = async () => {
          try {
            await loadUserCart(); // 获取最新数据
            
            const newHash = calculateCartHash(cartItems);
            if (newHash !== lastCartHash) {
              console.log('购物车数据有更新，刷新显示');
              setLastCartHash(newHash);
            } else {
              console.log('购物车数据无变化，保持当前显示');
            }
          } catch (error) {
            console.error('检查购物车更新失败:', error);
          }
        };
        
        checkCartUpdates();
      }
    }, 30000); // 每30秒检查一次
    
    // 组件卸载时清除定时器
    return () => clearInterval(intervalId);
  }, []); // 仅在组件挂载时运行一次

  return (
    <div>
      <Title level={2}>购物车</Title>
      <Divider />
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '30px 0' }}>
          <Spin size="large" tip="加载购物车中..." />
        </div>
      ) : (
        <CartItem 
          cartItems={cartItems} 
          removeFromCart={removeFromCart} 
          updateCartItemQuantity={updateCartItemQuantity} 
          getCartTotal={getCartTotal}
          createOrder={createOrder}
          navigate={navigate}
        />
      )}
    </div>

  );
}