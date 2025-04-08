import React, { createContext, useContext, useState } from 'react';

const ShopContext = createContext(); //创建了一个上下文对象 ShopContext，用于在组件树中共享购物车的状态和方法。

export default function ShopProvider({ children }) {
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
//ShopContext.Provider 将购物车的状态和方法传递给子组件。
//value 属性中包含了所有需要共享的状态和方法。

// 自定义 Hook 必须以 use 开头
export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
} 