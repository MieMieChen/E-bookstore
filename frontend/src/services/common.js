export const API_BASE = 'http://localhost:8080';
export const PREFIX = 'http://localhost:8080/api';

// 处理响应的通用函数
async function handleResponse(response) {
    if (response.status === 401) {
        throw new Error('未登录或登录已过期');
    }
    return response;
}

// 带认证检查的fetch包装函数
export async function fetchWithAuth(url, options = {}) {
    // 确保包含credentials
    const fetchOptions = {
        ...options,
        credentials: 'include'
    };
    
    const response = await fetch(url, fetchOptions);
    return handleResponse(response);
}

// 处理API响应的通用函数
export async function processResponse(response) {
    const data = await response.json();
    return {
        ok: response.ok,
        status: response.status,
        data: data,
        message: data.message
    };
}

export async function getJson(url) {
    const res = await fetchWithAuth(url, { method: "GET" });
    return processResponse(res);
}

export async function get(url) {
    return await fetchWithAuth(url, { method: "GET" });
}

export async function put(url, data) {
    let opts = {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const res = await fetchWithAuth(url, opts);
    return processResponse(res);
}

export async function del(url, data) {
    const res = await fetchWithAuth(url, { 
        method: "DELETE", 
        body: JSON.stringify(data) 
    });
    return processResponse(res);
}

export async function post(url, data) {
    let opts = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const res = await fetchWithAuth(url, opts);
    return processResponse(res);
}

// export const BASEURL = process.env.REACT_APP_BASE_URL ?? 'http://localhost:8080';
//如果使用了vite
//export const BASEURL = import.meta.env.VITE_REACT_APP_BASE_URL ?? "http://localhost:8080";
// export const PREFIX = `${BASEURL}/api`;
// export const API_DOCS_URL = `${BASEURL}/api-docs`;
export const DUMMY_RESPONSE = {
    ok: false,
    message: "网络错误！"
}