import { PREFIX } from "./common";
//即使后端使用了 @RestController 把数据变成了 JSON 放在响应体里发过来，
//前端接收到的是包含这个 JSON 字符串的原始响应。你需要调用 res.json() 来读取并解析这个 JSON 字符串，最终得到你在 JavaScript 中可以使用的对象
export async function getBooks() {
  const res = await fetch(`${PREFIX}/books`,
    {
          credentials:'include'
    }
  );
  if (!res.ok) throw new Error('获取图书失败');
  return await res.json();
}
// 获取图书详情
export async function getBookById(id) {
  const res = await fetch(`${PREFIX}/books/${id}`,
    {
          credentials:'include'
    }
  );
  if (!res.ok) throw new Error('获取图书详情失败');
  return await res.json();
}

// 获取热门图书
export async function getHotBooks() {
  const res = await fetch(`${PREFIX}/books/hot`,
    {
          credentials:'include'
    }
  );
  if (!res.ok) throw new Error('获取热门图书失败');
  return await res.json();
}

// 获取新书
export async function getNewBooks() {
  const res = await fetch(`${PREFIX}/books/new`,
    {
          credentials:'include'
    }
  );
  if (!res.ok) throw new Error('获取新书失败');
  return await res.json();
}

// 搜索图书
export async function searchBooks(searchType, query) {
  const params = new URLSearchParams();
  params.append('keyword', query);
  params.append('type', searchType);
  const res = await fetch(`${PREFIX}/books/search?${params.toString()}`,
  {
        credentials:'include'
  }
);
  if (!res.ok) throw new Error('搜索图书失败');
  return await res.json();
}
