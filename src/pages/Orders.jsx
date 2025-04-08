import React from 'react';
// import { Table, Tag, Typography, Divider } from 'antd';
import { useShop } from '../context/ShopContext';
import OrderTable from '../components/order_table';
const { Title } = Typography;

function Orders() {
  const { orders } = useShop();


  return (
    <div>
      <Title level={2}>我的订单</Title>
      <Divider />
      <OrderTable orders={orders} />
    </div>
  );
}

export default Orders;