import { PREFIX } from "./common";
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
    body: JSON.stringify(cartItem),
    credentials:'include'
  });
  if (!res.ok) throw new Error('加入购物车失败');
  return await res.json();
}

// 更新购物车数量
export async function updateCartQuantity(cartId, quantity) {
  const res = await fetch(`${PREFIX}/cart/${cartId}/quantity`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
    credentials:'include'
  });
  if (!res.ok) throw new Error('更新购物车数量失败');
  return await res.json();
}

// 删除购物车项
export async function removeFromCart(cartId) {
  const res = await fetch(`${PREFIX}/cart/${cartId}`, { method: 'DELETE',credentials:'include' });
  if (!res.ok) throw new Error('删除购物车项失败');
}

// 清空用户的所有购物车项
export async function clearUserCart(userId) {
  const res = await fetch(`${PREFIX}/cart/user/${userId}`, { method: 'DELETE',credentials:'include' });
  if (!res.ok) throw new Error('清空购物车失败');
}
