import React, { useEffect, useState, useCallback } from 'react';
import { Typography, Divider, Empty, Spin } from 'antd';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import OrderTable from '../components/order_table';
const { Title } = Typography;

function Orders() {
  const { orders, loadUserOrders } = useShop();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [lastOrdersHash, setLastOrdersHash] = useState('');

  // 计算订单列表的哈希值，用于比较是否有变化
  const calculateOrdersHash = useCallback((ordersList) => {
    if (!ordersList || ordersList.length === 0) return '';
    return JSON.stringify(ordersList.map(order => ({
      id: order.id,
      status: order.status
    })));
  }, []);

  // 当组件加载时，确保获取最新的订单数据
  useEffect(() => {
    const fetchOrders = async () => {
      if (isAuthenticated()) {
        setLoading(true);
        try {
          await loadUserOrders();
          // 更新最后一次加载的订单哈希值
          setLastOrdersHash(calculateOrdersHash(orders));
        } catch (error) {
          console.error('加载订单失败:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    // 仅在组件首次加载时获取订单数据
    fetchOrders();
    
    // 设置定时器，定期检查订单是否有变化
    const intervalId = setInterval(() => {
      if (isAuthenticated()) {
        // 执行静默检查，不显示加载状态
        const checkOrderUpdates = async () => {
          try {
            await loadUserOrders(); // 获取最新数据
            
            const newHash = calculateOrdersHash(orders);
            // 如果订单内容有变化，更新哈希值
            if (newHash !== lastOrdersHash) {
              console.log('订单数据有更新，刷新显示');
              setLastOrdersHash(newHash);
            } else {
              console.log('订单数据无变化，保持当前显示');
            }
          } catch (error) {
            console.error('检查订单更新失败:', error);
          }
        };
        
        checkOrderUpdates();
      }
    }, 60000); // 每60秒检查一次
    
    // 组件卸载时清除定时器
    return () => clearInterval(intervalId);
  }, []); // 仅在组件挂载时运行一次

  return (
    <div>
      <Title level={2}>我的订单</Title>
      <Divider />
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '30px 0' }}>
          <Spin size="large" tip="加载订单中..." />
        </div>
      ) : orders && orders.length > 0 ? (
        <OrderTable orders={orders} />
      ) : (
        <Empty 
          description="暂无订单记录" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </div>
  );
}

export default Orders;