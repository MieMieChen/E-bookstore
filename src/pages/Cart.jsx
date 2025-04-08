import React from 'react';
import { Typography, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import CartItem from '../components/cart_item';

const { Title } = Typography;

function Cart() {
  const navigate = useNavigate();
  const { 
    cartItems, 
    removeFromCart, 
    updateCartItemQuantity, 
    getCartTotal,
    createOrder 
  } = useShop();

  return (
    <div>
      <Title level={2}>购物车</Title>
      <Divider />
      <CartItem 
        cartItems={cartItems} 
        removeFromCart={removeFromCart} 
        updateCartItemQuantity={updateCartItemQuantity} 
        getCartTotal={getCartTotal}
        createOrder={createOrder}
        navigate={navigate}
      />
    </div>
  );
}

export default Cart;