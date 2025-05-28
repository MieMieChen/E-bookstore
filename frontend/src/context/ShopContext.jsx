import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

const ShopContext = createContext(); //创建了一个上下文对象 ShopContext，用于在组件树中共享购物车的状态和方法。

export function ShopProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // 使用AuthContext获取当前用户
  const { getUser, isAuthenticated, currentUser } = useAuth();
  
  // 加载用户购物车数据 - 使用useCallback包装以保持引用稳定性
  const loadUserCart = useCallback(async () => {
    if (!isAuthenticated()) return;
    
    try {
      // console.log('当前用户', userData);
      console.log("localStorage中的用户数据:", localStorage.getItem('currentUser'));
      const userData = await getUser(currentUser.id);
      console.log("userData111:", userData);
      console.log('当前用户ID:', userData.id);
      const userCartItems = await getCart(userData.id);
      
      // 转换为前端购物车格式
      const frontendCartItems = userCartItems.map(item => ({
        id: item.book.id,
        title: item.book.title,
        author: item.book.author,
        price: item.price || item.book.price,
        quantity: item.quantity,
        cover: item.book.imageUrl
      }));
      
      console.log('成功加载购物车数据:', frontendCartItems);
      setCartItems(frontendCartItems);
    } catch (error) {
      console.error('加载购物车数据失败:', error);
    }
  }, [isAuthenticated, getUser]);
  
  // 加载用户订单历史 - 使用useCallback包装以保持引用稳定性
  const loadUserOrders = useCallback(async () => {
    if (!isAuthenticated()) return;
    
    try {
      console.log('正在加载用户订单历史...');
      // console.log('当前用户', userData);
      // const userData = getUser();
      console.log('当前用户ID:', currentUser.id);
      const userOrders = await getOrders(currentUser.id);
      
      console.log('成功加载订单历史:', userOrders);
      setOrders(userOrders);
    } catch (error) {
      console.error('加载订单历史失败:', error);
    }
  }, [isAuthenticated, getUser]);

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
      const user = await getUser(currentUser.id);
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
      const user = await getUser(currentUser.id);
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
      const user = getUser();
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
  }, [getUser, removeFromCart]);

  const createOrder = async (items, total) => {
    try {
      const user = await getUser(currentUser.id);
      
      // 确保items是有效数组且包含必要字段
      if (!Array.isArray(items) || items.length === 0) {
        throw new Error('无效的订单项：购物车为空或格式不正确');
      }
      
      // 验证商品项格式
      const invalidItems = items.filter(item => 
        !item || !item.id || typeof item.quantity !== 'number' || !item.price
      );
      
      if (invalidItems.length > 0) {
        console.error('检测到无效的商品项:', invalidItems);
        throw new Error('无效的订单项：部分商品信息不完整');
      }
      
      // 在创建订单前，先获取所有购物车项
      console.log('获取数据库中的购物车数据...');
      const dbCartItems = await getCart(user.id);
      console.log('数据库中的购物车数据:', dbCartItems);
      
      // 获取所有要结算的书籍ID
      const bookIdsToCheckout = items.map(item => item.id);
      console.log('要结算的书籍ID:', bookIdsToCheckout);
      
      // 创建订单对象
      const newOrder = {
        user: { id: user.id }, // 从当前登录用户获取ID
        totalAmount: total,
        status: 'PENDING', // 使用后端定义的枚举值
        orderItems: items.map(item => ({
          book: { id: item.id },
          quantity: item.quantity,
          price: item.price
        }))
      };

      console.log('正在创建订单...', JSON.stringify(newOrder, null, 2));
      
      // 调用后端API创建订单
      const savedOrder = await createOrderApi(newOrder);
      console.log('订单创建成功:', savedOrder);
      
      // 更新前端状态
      setOrders(prevOrders => [savedOrder, ...prevOrders]);
      
      // 创建订单后清空购物车（前端状态）
      setCartItems([]);
      
      // 精确删除数据库中对应的购物车项
      console.log('正在删除数据库中的购物车项...');
      let deletionSuccess = true;
      try {
        // 找出数据库中对应要结算的购物车项
        const cartItemsToDelete = dbCartItems.filter(cartItem => 
          bookIdsToCheckout.includes(cartItem.book.id)
        );
        
        console.log('要删除的购物车项:', cartItemsToDelete);
        
        // 逐个删除购物车项
        for (const cartItem of cartItemsToDelete) {
          console.log(`删除购物车项ID: ${cartItem.id}, 书籍ID: ${cartItem.book.id}`);
          await removeFromCartApi(cartItem.id);
        }
        
        console.log('购物车项删除成功');
      } catch (deleteError) {
        console.error('删除购物车项出错:', deleteError);
        deletionSuccess = false;
        
        // 尝试使用备用方法 - 清空整个购物车
        try {
          console.log('尝试使用备用方法清空购物车...');
          await clearUserCartApi(user.id);
          console.log('备用方法清空购物车成功');
        } catch (fallbackError) {
          console.error('备用清空方法也失败:', fallbackError);
        }
      }
      
      // 结算后验证购物车是否为空
      if (!deletionSuccess) {
        console.log('尝试验证购物车是否清空...');
        try {
          const remainingItems = await getCart(user.id);
          if (remainingItems && remainingItems.length > 0) {
            console.warn('购物车清空不完全，剩余项目:', remainingItems);
          } else {
            console.log('验证成功: 购物车已清空');
          }
        } catch (verifyError) {
          console.error('验证购物车状态失败:', verifyError);
        }
      }
      
      return savedOrder;
    } catch (error) {
      console.error('订单创建失败:', error);
      // 详细记录错误信息以便调试
      if (error.message) console.error('错误消息:', error.message);
      if (error.stack) console.error('错误堆栈:', error.stack);
      
      // 即使API调用失败，仍然更新前端状态以保持良好的用户体验
      const fallbackOrder = {
        id: Date.now(),
        items: items,
        total: total,
        status: '待付款',
        date: new Date().toISOString(),
      };
      setOrders(prevOrders => [fallbackOrder, ...prevOrders]);
      setCartItems([]);
      return fallbackOrder;
    }
  };

  // const changeUserData = (newData) => {
  //   setUserData(newData);
  // };

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