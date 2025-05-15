import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography,Divider,} from 'antd';
import { books } from '../data/books';
import { useShop } from '../context/ShopContext';
import '../css/global.css';
import BookCard from '../components/bookCard';
 //console.log('当前书籍数据:', books.map(b => ({ id: b.id, title: b.title })));

function BookDetail() {
  //每次渲染组件，useParams 都会重新获取路由参数，确保获取的是最新的参数。
  // useState 的初始值仅首次渲染执行	React 会保留状态，只有 setBookPrice 触发时会重新渲染
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart,getCartTotal ,createOrder,cartItems} = useShop();
  const [bookPrice,setBookPrice] = useState(0);
  const book = books.find((book) => {
    // console.log('当前对比 ID:', book.id, typeof book.id); 
    // console.log('路由参数 ID:', id, typeof id);
    return book.id == id;
  });

  if (!book) {
    return <div>图书不存在</div>;
  }

  const handleAddToCart = () => {
    addToCart(book);
    navigate('/cart');
  };

  const handleBuyNow = (price) => {
    setBookPrice(price);
    createOrder(cartItems, price);
    navigate('/orders');
  };
  return (
    <div>
      <Typography.Title level={1}>图书详情</Typography.Title>
      <Divider />
      <BookCard 
        book={book}
        handleAddToCart={handleAddToCart}
        handleBuyNow={handleBuyNow}
      />
    </div>
  );
}

export default BookDetail;
