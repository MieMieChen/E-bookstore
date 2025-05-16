// const API_BASE = 'http://localhost:8080/api';
import { PREFIX } from "./common";
// 注册
export async function register(user) {
  const res = await fetch(`${PREFIX}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
    credentials:'include'
  });
  if (!res.ok) throw new Error('注册失败');
  return await res.json();
}

// 获取用户信息
export async function getUserInfo(userId) {
  const res = await fetch(`${PREFIX}/users/${userId}`);
  if (!res.ok) throw new Error('获取用户信息失败');
  return await res.json();
}

// 更新用户信息
export async function updateUserInfo(userId, userData) {
  const res = await fetch(`${PREFIX}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
    credentials:'include'
  });
  if (!res.ok) throw new Error('更新用户信息失败');
  return await res.json();
}

// 获取所有图书
export async function getBooks() {
  const res = await fetch(`${PREFIX}/books`);
  if (!res.ok) throw new Error('获取图书失败');
  return await res.json();
}

// 获取图书详情
export async function getBookById(id) {
  const res = await fetch(`${PREFIX}/books/${id}`);
  if (!res.ok) throw new Error('获取图书详情失败');
  return await res.json();
}

// 获取热门图书
export async function getHotBooks() {
  const res = await fetch(`${PREFIX}/books/hot`);
  if (!res.ok) throw new Error('获取热门图书失败');
  return await res.json();
}

// 获取新书
export async function getNewBooks() {
  const res = await fetch(`${PREFIX}/books/new`);
  if (!res.ok) throw new Error('获取新书失败');
  return await res.json();
}

// 搜索图书
export async function searchBooks(searchType, query) {
  const params = new URLSearchParams();
  params.append('keyword', query);
  params.append('type', searchType);
  const res = await fetch(`${PREFIX}/books/search?${params.toString()}`);
  if (!res.ok) throw new Error('搜索图书失败');
  return await res.json();
}

// 获取购物车
export async function getCart(userId) {
  const res = await fetch(`${PREFIX}/cart/${userId}`);
  if (!res.ok) throw new Error('获取购物车失败');
  return await res.json();
}

// 加入购物车
export async function addToCart(cartItem) {
  const res = await fetch(`${PREFIX}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cartItem)
  });
  if (!res.ok) throw new Error('加入购物车失败');
  return await res.json();
}

// 更新购物车数量
export async function updateCartQuantity(cartId, quantity) {
  const res = await fetch(`${PREFIX}/cart/${cartId}/quantity`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity })
  });
  if (!res.ok) throw new Error('更新购物车数量失败');
  return await res.json();
}

// 删除购物车项
export async function removeFromCart(cartId) {
  const res = await fetch(`${PREFIX}/cart/${cartId}`, { method: 'DELETE' ,credentials: 'include'});
  if (!res.ok) throw new Error('删除购物车项失败');
}

// 清空用户的所有购物车项
export async function clearUserCart(userId) {
  const res = await fetch(`${PREFIX}/cart/user/${userId}`, { method: 'DELETE' ,credentials:'include'});
  if (!res.ok) throw new Error('清空购物车失败');
}

// 获取用户订单列表
export async function getOrders(userId) {
  const res = await fetch(`${PREFIX}/orders/${userId}`);
  if (!res.ok) throw new Error('获取订单失败');
  return await res.json();
}

// 获取订单详情
export async function getOrderDetail(orderId) {
  const res = await fetch(`${PREFIX}/orders/detail/${orderId}`);
  if (!res.ok) throw new Error('获取订单详情失败');
  return await res.json();
}

// 创建订单
export async function createOrder(order) {
  try {
    console.log('API调用: 创建订单，发送数据:', order);
    const res = await fetch(`${PREFIX}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
      credentials:'include'
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('创建订单API错误:', {
        status: res.status,
        statusText: res.statusText,
        errorBody: errorText
      });
      throw new Error(`创建订单失败: HTTP ${res.status} - ${errorText}`);
    }
    
    const data = await res.json();
    console.log('API调用成功: 创建订单，返回数据:', data);
    return data;
  } catch (error) {
    console.error('创建订单异常:', error);
    throw error;
  }
}

// 取消订单
export async function cancelOrder(orderId) {
  const res = await fetch(`${PREFIX}/orders/${orderId}/cancel`, {
    method: 'PUT',
    credentials:'include'
  });
  if (!res.ok) throw new Error('取消订单失败');
  return await res.json();
}

// 更新订单状态
export async function updateOrderStatus(orderId, status) {
  const res = await fetch(`${PREFIX}/orders/${orderId}/status?status=${status}`, {
    method: 'PUT',
    credentials:'include'
  });
  if (!res.ok) throw new Error('更新订单状态失败');
  return await res.json();
}