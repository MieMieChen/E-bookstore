import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { message, Modal } from 'antd';
import {
  addToCart as addToCartApi, 
  removeFromCart as removeFromCartApi,
  clearUserCart as clearUserCartApi,
  updateCartQuantity as updateCartQuantityApi,
  getCart
} from '../services/cart';

import{
  createOrder as createOrderApi,
  getOrders
}from '../services/order';

import { useAuth } from './AuthContext';
import { getBookById } from '../services/book';

const ShopContext = createContext(); //创建了一个上下文对象 ShopContext，用于在组件树中共享购物车的状态和方法。

export function ShopProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // 使用AuthContext获取当前用户
  const {getMe, isAuthenticated, currentUser } = useAuth();
  
  // 加载用户购物车数据 - 使用useCallback包装以保持引用稳定性
  const loadUserCart = useCallback(async () => {
    if (!isAuthenticated()) return;
    try {
      const userCartItems = await getCart();
      // 转换为前端购物车格式
      const frontendCartItems = userCartItems.map(item => ({
        id: item.book.id,
        title: item.book.title,
        author: item.book.author,
        price: item.price || item.book.price,
        quantity: item.quantity,
        cover: item.book.imageUrl
      }));
      setCartItems(frontendCartItems);
    } catch (error) {
      console.error('加载购物车数据失败:', error);
    }
  }, [isAuthenticated]);
  
  // 加载用户订单历史 - 使用useCallback包装以保持引用稳定性
  const loadUserOrders = useCallback(async () => {
    if (!isAuthenticated()) return;
    try {
      const userOrders = await getOrders();
      setOrders(userOrders);
    } catch (error) {
      console.error('加载订单历史失败:', error);
    }
  }, [isAuthenticated]);

  // 当用户登录状态改变时加载数据
  useEffect(() => {
    const loadUserData = async () => {
      if (isAuthenticated()) {
        try {
          // 加载购物车数据
          await loadUserCart();
          
          // 加载订单历史 
          await loadUserOrders();
        } catch (error) {
          console.error('加载用户数据失败:', error);
        }
      } else {
        // 用户未登录，清空状态
        setCartItems([]);
        setOrders([]);
      }
    };
    
    loadUserData();
  }, [isAuthenticated, currentUser, loadUserCart, loadUserOrders]); // 依赖项包含稳定的函数引用

  const addToCart = async (book) => {
    // 先更新前端状态，确保UI立即响应
    let newQuantity = 1;
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === book.id);
      if (existingItem) {
        newQuantity = existingItem.quantity + 1;
        return prevItems.map(item =>
          item.id === book.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      return [...prevItems, { ...book, quantity: 1 }];
    });

    // 然后尝试调用后端API（不影响用户体验）
    try {
      const user = await getMe();
      const cartItem = {
        user: { id: user.id }, // 从当前登录用户获取ID
        book: { id: book.id },
        quantity: newQuantity, // 使用计算后的数量
        price: book.price
      };
      await addToCartApi(cartItem);
      //console.log('购物车同步到服务器成功');
    } catch (error) {
      // console.error('购物车同步到服务器失败:', error);
    }
  };

  const removeFromCart = async (bookId) => {
    // 获取需要删除的购物车项的ID
    const cartItemToRemove = cartItems.find(item => item.id === bookId);
    if (!cartItemToRemove) return;

    // 先更新前端状态
    setCartItems(prevItems => prevItems.filter(item => item.id !== bookId));
    
    // 然后尝试调用后端API
    try {
      const user = await getMe();
      // 注意：这里需要传递购物车项的数据库ID，而不是书籍ID
      // 由于我们没有在前端存储购物车项的数据库ID，需要先通过API获取
      const userCartItems = await getCart(user.id);
      const dbCartItem = userCartItems.find(item => item.book.id === bookId);
      
      if (dbCartItem) {
        await removeFromCartApi(dbCartItem.id);
        console.log('从服务器删除购物车项成功');
      }
    } catch (error) {
      console.error('从服务器删除购物车项失败:', error);
    }
  };

  const updateCartItemQuantity = useCallback(async (bookId, quantity) => {
    // 先更新前端状态，保证UI响应速度
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === bookId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0)
    );
    
    // 如果数量为0，实际上应该删除这个项
    if (quantity <= 0) {
      try {
        await removeFromCart(bookId);
        console.log('购物车项删除成功');
      } catch (error) {
        console.error('删除购物车项失败:', error);
      }
      return;
    }
    
    // 同步到后端
    try {
      const user = getMe();
      console.log(`正在更新商品 ${bookId} 的数量为 ${quantity}...`);
      
      // 查找购物车项的数据库ID
      const userCartItems = await getCart(user.id);
      const dbCartItem = userCartItems.find(item => item.book.id === bookId);
      
      if (dbCartItem) {
        // 调用后端API更新数量
        await updateCartQuantityApi(dbCartItem.id, quantity);
        console.log('购物车数量更新成功');
      } else {
        console.error('找不到对应的购物车项，无法更新数量');
      }
    } catch (error) {
      console.error('更新购物车数量失败:', error);
    }
  }, [getMe, removeFromCart]);

  const createOrder = async (items, total) => {
    try {
      const user = await getMe();
      
      // 确保items是有效数组且包含必要字段
      if (!Array.isArray(items) || items.length === 0) {
        console.error('购物车错误：', items);
        Modal.error({
          title: '购物车错误',
          content: '购物车为空或格式不正确，请检查后重试。',
          okText: '确定'
        });
        return null;
      }
      
      // 获取所有书籍的最新状态
      const booksStatus = await Promise.all(
        items.map(item => getBookById(item.id))
      );
      
      // 找出已下架的商品
      const unavailableItems = items.filter((item, index) => {
        const bookInfo = booksStatus[index];
        return !bookInfo.onShow;
      });

      // 如果有下架商品，显示弹窗
      if (unavailableItems.length > 0) {
        // console.log("发现下架商品：", unavailableItems);
        const unavailableNames = unavailableItems
          .map(item => item.title)
          .join('、');

        Modal.error({
          title: '商品已下架',
          content: `以下商品已下架，无法完成结算：${unavailableNames}。请从购物车中移除这些商品后再试。`,
          okText: '我知道了'
        });
        return null;
      }
      
      // 过滤出可购买的商品
      const validItems = items.filter((item, index) => {
        const bookInfo = booksStatus[index];
        return bookInfo.onShow;
      });

      // 重新计算总价
      const validTotal = validItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      
      // 创建订单对象
      const newOrder = {
        user: { id: user.id },
        totalAmount: validTotal,
        status: 'PENDING',
        orderItems: validItems.map(item => ({
          book: { id: item.id },
          quantity: item.quantity,
          price: item.price
        }))
      };

      // 调用后端API创建订单
      const savedOrder = await createOrderApi(newOrder);
      
      // 更新前端状态
      setOrders(prevOrders => [savedOrder, ...prevOrders]);
      setCartItems([]);
      
      // 清空购物车
      try {
        await clearUserCartApi(user.id);
      } catch (error) {
        Modal.warning({
          title: '提示',
          content: '订单已创建，但购物车清空失败，请刷新页面。'
        });
      }
      
      return savedOrder;
    } catch (error) {
      console.error('创建订单时发生错误:', error);
      Modal.error({
        title: '创建订单失败',
        content: error.message || '创建订单时发生错误，请稍后重试。',
        okText: '确定'
      });
      return null;
    }
  };



  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };
  const updateOrders = (newOrders) => {
    setOrders(newOrders);
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
      updateOrders,
      // userData,
      // changeUserData,
      loadUserCart,     // 暴露方法以便手动刷新
      loadUserOrders    // 暴露方法以便手动刷新
    }}>
      {children}
    </ShopContext.Provider>
  );
}
//ShopContext.Provider 将购物车的状态和方法传递给子组件。
//value 属性中包含了所有需要共享的状态和方法。

// 自定义 Hook 必须以 use 开头 自己封装了一个API，方便其他组件使用上下文中的值。
// useContext 是 React 内置的 Hook，用于在函数组件中访问上下文的值。
export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
} 