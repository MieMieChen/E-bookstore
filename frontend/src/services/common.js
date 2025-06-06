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
    const res = await handleResponse(response);
    console.log("fetchWithAuth response:", res);
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
    return res;
}

export async function post(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        let responseData;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            responseData = await response.json();
        } else {
            const text = await response.text();
            responseData = { message: text };
        }

        return {
            ok: response.ok,
            status: response.status,
            message: responseData.message || '操作失败',
            data: responseData.data || responseData
        };
    } catch (error) {
        console.error('POST request failed:', error);
        return {
            ok: false,
            status: 500,
            message: '请求失败，请稍后重试',
            data: null
        };
    }
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