const API_BASE = 'http://localhost:8080/api';
import  {post} from './common';
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

    console.log('Sending login request:', { username, password: '***' });
    const url = `${API_BASE}/auth/login`;
    const response = await post(url, { username, password });
    
    console.log('Login response status:', response.status);
    
    const data = await response.json();
    console.log('Login response data:', data);
    
    result = {
      ok: response.ok,
      data: data,
      message: response.ok ? "登录成功！" : (data.message || "登录失败")
    };
  } catch (e) {
    console.error('Login error:', e);
    result = {
      ok: false,
      message: "网络错误，请稍后重试"
    };
  }
  
  console.log('Final login result:', result);
  return result;
}