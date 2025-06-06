import { PREFIX,get,post, put } from "./common";
import { format } from 'date-fns';

export async function getOrders(userId) {
  const url = `${PREFIX}/orders/${userId}`;
  const res = await get(url);
  if (!res.ok) throw new Error('获取订单失败');
  return await res.json();
}
export async function getAllOrders() {
  const url = `${PREFIX}/admin/orders`;
  const res = await get(url);
  if (!res.ok) throw new Error('获取所有订单失败');
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
  return res;
}
export async function payOrder(orderId) {
  const url = `${PREFIX}/orders/${orderId}/pay`;
  const res = await put(url, null);
  if (!res.ok) throw new Error('支付订单失败');
  return res;
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

export async function searchOrders(params) {
  const queryParams = new URLSearchParams();

  // 辅助函数：格式化日期以适应后端需求
  const formatDateTimeForBackend = (dateString) => {
    if (!dateString) return null;
    // 假设 dateString 已经是 date-fns 可以解析的格式
    // 例如，'YYYY-MM-DD HH:mm:ss' 或 Date 对象
    // 我们想要将其转换为 'YYYY-MM-DDTHH:mm:ss'
    return format(new Date(dateString), "yyyy-MM-dd'T'HH:mm:ss");
  };

  if (params.startTime) {
    const formattedStartTime = formatDateTimeForBackend(params.startTime);
    if (formattedStartTime) {
      queryParams.append('startTime', formattedStartTime);
    }
  }

  if (params.endTime) {
    const formattedEndTime = formatDateTimeForBackend(params.endTime);
    if (formattedEndTime) {
      queryParams.append('endTime', formattedEndTime);
    }
  }

  if (params.bookTitle) {
    queryParams.append('bookTitle', params.bookTitle);
  }

  const url = `${PREFIX}/orders/search?${queryParams.toString()}`;
  console.log('Sending request to:', url);
  
  const res = await get(url);
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Search orders failed:', {
      status: res.status,
      statusText: res.statusText,
      errorBody: errorText
    });
    throw new Error(`搜索订单失败: ${res.status} - ${errorText}`);
  }
  
  const data = await res.json();
  console.log('Search orders response:', data);
  return data;
}