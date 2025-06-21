import { PREFIX, get, processResponse,post,put,del } from "./common";
//即使后端使用了 @RestController 把数据变成了 JSON 放在响应体里发过来，
//前端接收到的是包含这个 JSON 字符串的原始响应。你需要调用 res.json() 来读取并解析这个 JSON 字符串，最终得到你在 JavaScript 中可以使用的对象
export async function getBooks() {
  try {
    const url = `${PREFIX}/books`;
    const res = await get(url);
    const data = await res.json();
    console.log('Books data:', data); // 添加日志
    return data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw new Error('获取图书失败');
  }
}

// 获取图书详情
export async function getBookById(id) {
  try {
    const url = `${PREFIX}/books/${id}`;
    const res = await get(url);
    return await res.json();
  } catch (error) {
    console.error('Error fetching book details:', error);
    throw new Error('获取图书详情失败');
  }
}

// 获取热门图书
export async function getHotBooks() {
  try {
    const url = `${PREFIX}/books/hot`;
    const res = await get(url); //因为这些返回的都是response响应体，需要自己解析成json
    return await res.json();
  } catch (error) {
    console.error('Error fetching hot books:', error);
    throw new Error('获取热门图书失败');
  }
}

// 获取新书
export async function getNewBooks() {
  try {
    const url = `${PREFIX}/books/new`;
    const res = await get(url);
    return await res.json();
  } catch (error) {
    console.error('Error fetching new books:', error);
    throw new Error('获取新书失败');
  }
}

export async function searchBooks(searchType, query, page, pageSize) {
  try {
    const params = new URLSearchParams();
    
    // 只有当搜索关键词不为空时，才添加搜索相关的参数
    if (query) {
      params.append('keyword', query);
      params.append('type', searchType);
    }

    // 添加分页参数 (后端需要 0-based index)
    params.append('page', page - 1); 
    params.append('size', pageSize);

    let url;
    if (query) {
      // 当有搜索词时，调用搜索接口
      url = `${PREFIX}/books/search?${params.toString()}`;
    } else {
      // 当没有搜索词时，调用你提供的 paged 接口
      url = `${PREFIX}/books/paged?${params.toString()}`;
    }
    
    const res = await get(url);
    return await res.json();
  } catch (error) {
    console.error('Error searching books:', error);
    throw new Error('搜索图书失败');
  }
}


export async function addBook(bookData) {
  const url = `${PREFIX}/admin/books`;
  const res = await post(url,bookData);
  return  res;
  }

export async function updateBook(bookId, bookData) {
  const url = `${PREFIX}/admin/books/${bookId}`;
  console.log("Updating book with ID:", bookId, "Data:", bookData);
  const res = await put(url, bookData);
  return res;
  }

export async function deleteBook(bookId) {
  const url = `${PREFIX}/admin/books/delete/${bookId}`;
  const res = await put(url);
  return res;
}
export async function restoreBook(bookId) {
  const url = `${PREFIX}/admin/books/restore/${bookId}`;
  const res = await put(url);
  return res;
}