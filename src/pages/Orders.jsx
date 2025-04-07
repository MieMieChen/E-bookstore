import React from 'react';
import { Table, Tag, Typography, Divider } from 'antd';
import { useShop } from '../context/ShopContext';

const { Title } = Typography;

function Orders() {
  const { orders } = useShop();

  const columns = [
    {
      title: '订单号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleString('zh-CN')
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        if (status === '待付款') color = 'orange';
        if (status === '已付款') color = 'blue';
        if (status === '已发货') color = 'geekblue';
        if (status === '已完成') color = 'green';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: '总价',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `¥${total.toFixed(2)}`
    }
  ];

  return (
    <div>
      <Title level={2}>我的订单</Title>
      <Divider />
      <Table 
        columns={columns} 
        dataSource={orders} 
        rowKey="id"
        pagination={false}
      />
    </div>
  );
}

export default Orders;