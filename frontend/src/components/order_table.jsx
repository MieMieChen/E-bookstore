import React from 'react';
import { Table, Tag, Typography, Button, Space, Tooltip } from 'antd';
import { 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  CarOutlined, 
  FileTextOutlined, 
  CloseCircleOutlined
} from '@ant-design/icons';

import { getOrderStatus } from '../services/order';

const { Text } = Typography;

export default function OrderTable({ orders }) {
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

  // 获取排序日期 (用于表格排序)
  const getOrderDate = (record) => {
    return record.orderTime || record.createdAt || '';
  };

  const columns = [
    // {
    //   title: '订单号',
    //   dataIndex: 'id',
    //   key: 'id',
    //   render: (id) => <Text copyable>{id}</Text>,
    // },
    {
      title: '日期',
      key: 'date',
      dataIndex: 'orderTime', // 直接绑定orderTime字段
      render: (orderTime, record) => {
        const dateToShow = orderTime || record.createdAt;
        return formatDateTime(dateToShow);
      },
      sorter: (a, b) => {
        const dateA = new Date(getOrderDate(a));
        const dateB = new Date(getOrderDate(b));
        return dateB - dateA; // 降序排列，最近的在前
      },
      defaultSortOrder: 'descend', // 默认降序排列
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
    // {
    //   title: '操作',
    //   key: 'action',
    //   render: (_, record) => (
    //     <Space size="small">
    //       <Button type="link" size="small" onClick={() => console.log('查看订单', record.id)}>
    //         详情
    //       </Button>
    //       {record.status === 'PENDING' && (
    //         <Button type="link" danger size="small" onClick={() => console.log('取消订单', record.id)}>
    //           取消
    //         </Button>
    //       )}
    //     </Space>
    //   ),
    // }
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
                  {item.book?.title || `商品#${item.id}`} - 
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
