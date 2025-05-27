import { PREFIX, getJson, post } from './common';

// 注册新用户
export async function register(userData) {
    try {
        const response = await post(`${PREFIX}/auth/register`, userData);
        return {
            ok: response.ok,
            message: response.ok ? "注册成功！" : (response.message || "注册失败"),
            data: response.data
        };
    } catch (error) {
        console.error('Register error:', error);
        return {
            ok: false,
            message: "注册失败，请稍后重试"
        };
    }
}

// 获取当前登录用户信息
export async function getMe() {
    try {
        const response = await fetch(`${PREFIX}/auth/me`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('获取用户信息失败:', error);
        return null;
    }
}

// 检查用户是否已登录
export async function checkAuth() {
    const user = await getMe();
    return {
        isAuthenticated: !!user,
        user
    };
}

// 获取上一个访问的页面URL（用于登录后重定向）
export function getReturnUrl() {
    return sessionStorage.getItem('returnUrl') || '/';
}

// 保存当前页面URL（用于登录后重定向）
export function saveReturnUrl(url) {
    sessionStorage.setItem('returnUrl', url);
} 