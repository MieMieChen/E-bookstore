import { PREFIX, get, post, del, put } from "./common";

// 获取当前登录用户购物车
export async function getCart() {
  const url = `${PREFIX}/cart/me`;
  const res = await get(url);
  if (!res.ok) throw new Error('获取购物车失败');
  return await res.json();
}

// 加入购物车
export async function addToCart(cartItem) {
  const url = `${PREFIX}/cart`;
  const res = await post(url, cartItem);
  if (!res.ok) throw new Error('加入购物车失败');
  return await res.json();
}

// 更新购物车数量
export async function updateCartQuantity(cartId, quantity) {
  const url = `${PREFIX}/cart/${cartId}/quantity`;
  const res = await put(url, { quantity });
  if (!res.ok) throw new Error('更新购物车数量失败');
  return await res.json();
}

// 删除购物车项
export async function removeFromCart(cartId) {
  const url = `${PREFIX}/cart`;
  const res = await del(url, { cartId });
  if (!res.ok) throw new Error('删除购物车项失败');
}

// 清空当前用户购物车
export async function clearUserCart() {
  const url = `${PREFIX}/cart/me`;
  const res = await del(url);
  if (!res.ok) throw new Error('清空购物车失败');
}
