import { PREFIX } from "./common";
export async function getUserInfo(userId) {
  const res = await fetch(`${PREFIX}/users/${userId}`,
    {
      credentials:'include'
    }
  );
  if (!res.ok) throw new Error('获取用户信息失败');
  return await res.json();
}
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
