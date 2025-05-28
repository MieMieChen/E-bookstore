import { PREFIX,get,post, put } from "./common";
export async function getOrders(userId) {
  const url = `${PREFIX}/orders/${userId}`;
  const res = await get(url);
  if (!res.ok) throw new Error('获取订单失败');
  return await res.json();
}

// 获取订单详情
export async function getOrderDetail(orderId) {
  const url = `${PREFIX}/orders/detail/${orderId}`;
  const res = await get(url);
  if (!res.ok) throw new Error('获取订单详情失败');
  return await res.json();
}

// 创建订单
export async function createOrder(order) {
  try {
    console.log('API调用: 创建订单，发送数据:', order);
    const url = `${PREFIX}/orders`;
    const res = await post(url, order);
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
  const url = `${PREFIX}/orders/${orderId}/cancel`;
  const res = await put(url, null);
  if (!res.ok) throw new Error('取消订单失败');
  return await res.json();
}

// 更新订单状态
export async function updateOrderStatus(orderId, status) {
  const url = `${PREFIX}/orders/${orderId}/status?status=${status}`;
  const res = await put(url, null);
  if (!res.ok) throw new Error('更新订单状态失败');
  return await res.json();
}
export async function getOrderStatus(orderId) {
  const url = `${PREFIX}/orders/${orderId}/status`;
  const res = await get(url);
  return await res.json();
}