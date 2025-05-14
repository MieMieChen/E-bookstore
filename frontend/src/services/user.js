export async function getUserInfo(userId) {
  const res = await fetch(`${PREFIX}/users/${userId}`);
  if (!res.ok) throw new Error('获取用户信息失败');
  return await res.json();
}