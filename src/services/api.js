const API_BASE = 'http://localhost:8080/api';

// 登录
export async function login(username, password) {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error('登录失败');
  return await res.json();
}

// 注册
export async function register(user) {
  const res = await fetch(`${API_BASE}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  if (!res.ok) throw new Error('注册失败');
  return await res.json();
}

// 获取所有图书
export async function getBooks() {
  const res = await fetch(`${API_BASE}/books`);
  if (!res.ok) throw new Error('获取图书失败');
  return await res.json();
}

// 获取购物车
export async function getCart(userId) {
  const res = await fetch(`${API_BASE}/cart/${userId}`);
  if (!res.ok) throw new Error('获取购物车失败');
  return await res.json();
}

// 加入购物车
export async function addToCart(cartItem) {
  const res = await fetch(`${API_BASE}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cartItem)
  });
  if (!res.ok) throw new Error('加入购物车失败');
  return await res.json();
}

// 删除购物车项
export async function removeFromCart(cartId) {
  const res = await fetch(`${API_BASE}/cart/${cartId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('删除购物车项失败');
}

// 获取订单
export async function getOrders(userId) {
  const res = await fetch(`${API_BASE}/orders/${userId}`);
  if (!res.ok) throw new Error('获取订单失败');
  return await res.json();
}

// 下单
export async function createOrder(order) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  });
  if (!res.ok) throw new Error('下单失败');
  return await res.json();
}