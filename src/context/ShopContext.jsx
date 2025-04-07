import React, { createContext, useContext, useState } from 'react';

const ShopContext = createContext();

export default function ShopProvider({ children }) {
// cartItems: 购物车中的商品数组（当前状态）
// setCartItems: 用来更新购物车的函数
// []: 空数组作为初始值，表示购物车最初是空的
// orders: 订单列表数组（当前状态）
// setOrders: 用来更新订单的函数
// []: 空数组作为初始值，表示最初没有订单
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);

  const addToCart = (book) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === book.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...book, quantity: 1 }];
    });
  };

  const removeFromCart = (bookId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== bookId));
  };

  const updateCartItemQuantity = (bookId, quantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === bookId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const createOrder = (items, total) => {
    const newOrder = {
      id: Date.now(),
      items: items,
      total: total,
      status: '待付款',
      date: new Date().toISOString(),
    };
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    // 创建订单后清空购物车
    setCartItems([]);
    return newOrder;
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <ShopContext.Provider value={{
      cartItems,
      orders,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      createOrder,
      getCartTotal,
      getCartItemsCount,
    }}>
      {children}
    </ShopContext.Provider>
  );
}
// 自定义 Hook 必须以 use 开头
export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
} 