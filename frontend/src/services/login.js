import { PREFIX, post } from './common';

// 登录
export async function login(username, password) {
  let result;
  try {
    // 添加输入验证
    if (!username || !password) {
      return {
        ok: false,
        message: "用户名和密码不能为空"
      };
    }
    const response = await post(`${PREFIX}/auth/login`, { username, password });
    // console.log('Login response:', response);
    
    // response 现在包含 { ok, status, data, message }
    result = {
      ok: response.ok,
      data: response.data,
      message: response.ok ? "登录成功！" : (response.message || "登录失败")
    };
  } catch (e) {
    console.error('Login error:', e);
    result = {
      ok: false,
      message: "登录失败"
    };
  }
  
  // console.log('Final login result:', result);
  return result;
}