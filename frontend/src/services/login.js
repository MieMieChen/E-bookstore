const API_BASE = 'http://localhost:8080/api';

// 登录
export async function login(username, password) {
  let result; //一定要先定义
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }), //转换为json格式的对象
      credentials:'include' 
    });
    
    const data = await response.json();
    result = {
      ok: response.ok,
      data: data,
      message: response.ok ? "登录成功！" : data
    };
  } catch (e) {
    console.log('Login error:', e);
    result = {
      ok: false,
      message: "网络错误！"
      };
  }
  return result;
}