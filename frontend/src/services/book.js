import { PREFIX } from "./common";
export async function getBooks() {
  const res = await fetch(`${PREFIX}/books`);
  if (!res.ok) throw new Error('获取图书失败');
  return await res.json();
}
// 获取图书详情
export async function getBookById(id) {
  const res = await fetch(`${PREFIX}/books/${id}`);
  if (!res.ok) throw new Error('获取图书详情失败');
  return await res.json();
}

// 获取热门图书
export async function getHotBooks() {
  const res = await fetch(`${PREFIX}/books/hot`);
  if (!res.ok) throw new Error('获取热门图书失败');
  return await res.json();
}

// 获取新书
export async function getNewBooks() {
  const res = await fetch(`${PREFIX}/books/new`);
  if (!res.ok) throw new Error('获取新书失败');
  return await res.json();
}

// 搜索图书
export async function searchBooks(searchType, query) {
  const params = new URLSearchParams();
  params.append('keyword', query);
  params.append('type', searchType);
  const res = await fetch(`${PREFIX}/books/search?${params.toString()}`);
  if (!res.ok) throw new Error('搜索图书失败');
  return await res.json();
}
