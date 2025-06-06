import { PREFIX,get,put} from "./common";
export async function getUserInfo(userId) {
  const url = `${PREFIX}/users/${userId}`;
  const res = await get(url);
  if (!res.ok) throw new Error('获取用户信息失败');
  return res;
}
export async function updateUserInfo(userId, userData) {
  const url = `${PREFIX}/users/${userId}`;
  const res = await put(url, userData);
  if (!res.ok) throw new Error('更新用户信息失败');
  return res;
}
export async function updateUserInvalid(userId, userData) {
  const url = `${PREFIX}/users/${userId}/invalid`;
  const res = await put(url, userData);
  if (!res.ok) throw new Error('更新用户信息失败');
  return res;
}
export async function getAllUsers() {
  const url = `${PREFIX}/admin/users`;
  const res = await get(url);
  if (!res.ok) throw new Error('获取用户列表失败');
  return await res.json();
}
export async function setUserInvalid(userId) {
  const url = `${PREFIX}/admin/users/invalid/${userId}`;
  const res = await put(url);
  if (!res.ok) throw new Error('设置用户无效失败');
  return res;
}
export async function setUserValid(userId) {
  const url = `${PREFIX}/admin/users/valid/${userId}`;
  const res = await put(url);
  if (!res.ok) throw new Error('设置用户有效失败');
  return res;
}


