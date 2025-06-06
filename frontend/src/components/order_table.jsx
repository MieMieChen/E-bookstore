import React from 'react';
import { Table, Tag, Typography, Button, Space, Tooltip, message } from 'antd';
import { 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  CarOutlined, 
  FileTextOutlined, 
  CloseCircleOutlined,
  DeleteOutlined
} from '@ant-design/icons';

import { cancelOrder, payOrder } from '../services/order';
const { Text } = Typography;

export default function OrderTable({ orders, onUpdate }) {
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

  // 格式化日期时间显示
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '未知';
    try {
      const date = new Date(dateTimeStr);
      // 检查日期是否有效
      if (isNaN(date.getTime())) return '无效日期';
      return date.toLocaleString('zh-CN');
    } catch (error) {
      console.error('日期格式化错误:', error);
      return '格式错误';
    }
  };

  const handlePay = async (record) => {
    try {
      await payOrder(record.id);
      message.success('支付成功');
      // 调用更新回调
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('支付失败:', error);
      message.error('支付失败，请稍后重试');
    }
  };

  const handleDelete = async (orderId) => {
    try {
      await cancelOrder(orderId);
      message.success('取消订单成功');
      // 调用更新回调
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("取消订单失败:", error);
      message.error('取消订单失败，请稍后重试');
    }
  };

  // 获取排序日期 (用于表格排序)
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
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.status === 'PENDING' && (
            <>
              <Button type="primary" icon={<CheckCircleOutlined/>} onClick={() => handlePay(record)}>
                购买
              </Button>
              <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
                取消订单
              </Button>
            </>
          )}
        </Space>
      ),
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
