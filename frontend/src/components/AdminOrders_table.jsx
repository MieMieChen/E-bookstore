import React from 'react';
import { Table, Tag, Typography, Button, Space, Tooltip, message } from 'antd';
import { 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  CarOutlined, 
  FileTextOutlined, 
  CloseCircleOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

export default function AdminOrderTable({ orders, onUpdate }) {
  // 将后端的状态映射到前端显示状态
  const getStatusDisplay = (status) => {
    const statusMap = {
      'PENDING': { text: '待付款', color: 'orange', icon: <ClockCircleOutlined /> },
      'PAID': { text: '已付款', color: 'blue', icon: <CheckCircleOutlined /> },
      'SHIPPED': { text: '已发货', color: 'purple', icon: <CarOutlined /> },
      'DELIVERED': { text: '已完成', color: 'green', icon: <FileTextOutlined /> },
      'CANCELLED': { text: '已取消', color: 'red', icon: <CloseCircleOutlined /> }
    };
    
    return statusMap[status] || { text: status, color: 'default', icon: null };
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '未知';
    try {
      const date = new Date(dateTimeStr);
      if (isNaN(date.getTime())) return '无效日期';
      return date.toLocaleString('zh-CN');
    } catch (error) {
      console.error('日期格式化错误:', error);
      return '格式错误';
    }
  };

  const getOrderDate = (record) => {
    return record.orderTime || record.createdAt || '';
  };

  const columns = [
    {
      title: '日期',
      key: 'date',
      dataIndex: 'orderTime',
      render: (orderTime, record) => {
        const dateToShow = orderTime || record.createdAt;
        return formatDateTime(dateToShow);
      },
      sorter: (a, b) => {
        const dateA = new Date(getOrderDate(a));
        const dateB = new Date(getOrderDate(b));
        return dateB - dateA;
      },
      defaultSortOrder: 'descend',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const { text, color, icon } = getStatusDisplay(status);
        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      }
    },
    {
      title: '商品数量',
      key: 'itemCount',
      render: (record) => {
        const itemCount = record.orderItems?.length || 0;
        const totalQuantity = record.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        
        return (
          <Tooltip title={`${itemCount}种商品，共${totalQuantity}件`}>
            <Text>{totalQuantity}件</Text>
          </Tooltip>
        );
      }
    },
    {
      title: '总价',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (totalAmount) => `¥${(totalAmount || 0).toFixed(2)}`
    },
    {
    title: '用户',
    dataIndex: 'user',
    key: 'user',
    render: (user) => { // render 函数的第一个参数 'user' 就是当前行数据的 'user' 属性的值
        if (user && user.id) { // 检查 user 是否存在以及 user.id 是否存在，以防万一数据结构不完整
        return user.username;
        }
        return ''; 
    }
    },

  ];

  return (
    <Table 
      columns={columns} 
      dataSource={orders} 
      rowKey="id"
      pagination={false}
      expandable={{
        expandedRowRender: (record) => (
          <div style={{ padding: '0 12px' }}>
            <Text strong>订单商品：</Text>
            <ul>
              {record.orderItems?.map((item, index) => (
                <li key={index}>
                  {item.book?.title || '商品数据加载失败'} - 
                  数量: {item.quantity} - 
                  单价: ¥{(item.price || 0).toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        ),
      }}
    />
  );
}
