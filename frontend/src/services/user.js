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
