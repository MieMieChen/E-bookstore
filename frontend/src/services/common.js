export const API_BASE = 'http://localhost:8888';
export const PREFIX = 'http://localhost:8888/api';

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
    const res = await handleResponse(response);
    return res;
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
        headers: {
            'Content-Type': 'application/json'
        }
    };
     if (data) {
        opts.body = JSON.stringify(data);
    }
    const res = await fetchWithAuth(url, opts);
    return res;
}

export async function del(url, data) {
    let opts = {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        }
    };
    if (data) {
        opts.body = JSON.stringify(data);
    }
    const res = await fetchWithAuth(url, opts);
    return res;
}

export async function post(url, data) {
    let opts = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };
    if (data) {
        opts.body = JSON.stringify(data);
    }
    // 使用fetchWithAuth来确保包含认证信息
    const res = await fetchWithAuth(url, opts);
    return processResponse(res);
  
}

