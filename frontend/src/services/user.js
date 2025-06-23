import { PREFIX, get, put } from "./common";

// 获取当前登录用户信息
export async function getUserInfo() {
  const url = `${PREFIX}/users/me`;
  const res = await get(url);
  if (!res.ok) throw new Error('获取用户信息失败');
  return res;
}

// 获取用户购书统计
export async function getUserStats({ startTime, endTime}) {
  const url = `${PREFIX}/users/stats?start=${startTime}&end=${endTime}&isPersonalStats=true`;
  const res = await get(url);
  if (!res.ok) throw new Error('获取用户购书统计失败');
  return await res.json();
}

// 获取管理员书籍销量统计（热销榜）
export async function getAdminBookStats({ startTime, endTime }) {
  const url = `${PREFIX}/admin/stats/books?start=${startTime}&end=${endTime}&isPersonalStats=false`;
  const res = await get(url);
  if (!res.ok) throw new Error('获取书籍销量统计失败');
  return await res.json();
}

// 获取管理员用户消费统计（消费榜）
export async function getAdminUserStats({ startTime, endTime }) {
  const url = `${PREFIX}/admin/stats/users?start=${startTime}&end=${endTime}&isPersonalStats=false`;
  const res = await get(url);
  if (!res.ok) throw new Error('获取用户消费统计失败');
  return await res.json();
}

// 更新当前登录用户信息
export async function updateUserInfo(userData) {
  const url = `${PREFIX}/users/me`;
  const res = await put(url, userData);
  if (!res.ok) throw new Error('更新用户信息失败');
  return res;
}


// 获取所有用户（管理员）
export async function getAllUsers() {
  const url = `${PREFIX}/admin/users`;
  const res = await get(url);
  if (!res.ok) throw new Error('获取用户列表失败');
  return await res.json();
}

// 管理员操作：设置用户无效
export async function setUserInvalid(userId) {
  const url = `${PREFIX}/admin/users/invalid/${userId}`;
  const res = await put(url);
  if (!res.ok) throw new Error('设置用户无效失败');
  return res;
}

// 管理员操作：设置用户有效
export async function setUserValid(userId) {
  const url = `${PREFIX}/admin/users/${userId}/valid`;
  const res = await put(url);
  if (!res.ok) throw new Error('设置用户有效失败');
  return res;
}


