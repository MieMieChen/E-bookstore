import React, { useEffect, useState, useCallback } from 'react';
import { Typography, Divider, Empty, Spin, Button, message, Card, Statistic, Row, Col, Tag ,Space,Select,Input, DatePicker} from 'antd';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import OrderTable from '../components/order_table';
import { ReloadOutlined, ShoppingOutlined, FileTextOutlined } from '@ant-design/icons';
import useMessage from "antd/es/message/useMessage";
import { SearchOutlined } from '@ant-design/icons';
import {searchOrders} from '../services/order';
// import { getUserInfo } from '../services/user';
import { useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;

const { Title, Text } = Typography;

export function Orders() {
  const { orders, loadUserOrders, updateOrders } = useShop();
  const { isAuthenticated, currentUser, getMe } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastOrdersHash, setLastOrdersHash] = useState('');
  const [lastRefreshTime, setLastRefreshTime] = useState(null);
  const [userC, setUserC] = useState(null);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = useMessage();
  const [timeRange, setTimeRange] = useState(null);
  const [bookTitle, setBookTitle] = useState('');
  // const {userData} = useShop();
  useEffect(() => {
          const checkLogin = async () => {
              const me = await getMe();
              console.log("me", me);
              if (!me) {
                  messageApi.error("无权访问当前页面，请先登录！", 0.6)
                      .then(() => navigate("/login"));
              } else {
                  setUserC(me);
              }
          }
          checkLogin();
      }, [navigate]);
  // 获取当前用户
  const user = currentUser || getMe();

  // 计算订单列表的哈希值，用于比较是否有变化
  const calculateOrdersHash = useCallback((ordersList) => {
    if (!ordersList || ordersList.length === 0) return '';
    return JSON.stringify(ordersList.map(order => ({
      id: order.id,
      status: order.status,
      updatedAt: order.updatedAt
    })));
  }, []);

  // 获取订单状态统计
  const getOrderStatusStats = useCallback(() => {
    if (!orders || orders.length === 0) return {};
    
    return orders.reduce((stats, order) => {
      const status = order.status?.toLowerCase() || 'unknown';
      stats[status] = (stats[status] || 0) + 1;
      return stats;
    }, {});
  }, [orders]);

  // 手动刷新订单数据
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadUserOrders();
      setLastRefreshTime(new Date().toLocaleTimeString());
      message.success('订单列表已更新');
    } catch (error) {
      console.error('刷新订单失败:', error);
      message.error('刷新订单失败，请稍后再试');
    } finally {
      setRefreshing(false);
    }
  };

  // 当组件加载时，确保获取最新的订单数据
  useEffect(() => {
    const fetchOrders = async () => {
      if (isAuthenticated()) {
        setLoading(true);
        try {
          await loadUserOrders();
          
          // 更新最后一次加载的订单哈希值
          setLastOrdersHash(calculateOrdersHash(orders));
          setLastRefreshTime(new Date().toLocaleTimeString());
        } catch (error) {
          console.error('加载订单失败:', error);
          message.error('无法加载订单信息，请稍后再试');
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
            const currentHash = calculateOrdersHash(orders);
            await loadUserOrders(); // 获取最新数据
            
            const newHash = calculateOrdersHash(orders);
            // 如果订单内容有变化，更新哈希值并显示通知
            if (newHash !== currentHash && newHash !== lastOrdersHash) {
              console.log('订单数据有更新，刷新显示');
              setLastOrdersHash(newHash);
              setLastRefreshTime(new Date().toLocaleTimeString());
              message.info('您的订单有更新');
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

  // 获取订单统计信息
  const orderStats = getOrderStatusStats();
  const totalOrders = orders?.length || 0;
  const totalAmount = orders?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0;

  // 对订单进行排序，确保按时间降序显示
  const sortedOrders = React.useMemo(() => {
    if (!orders || orders.length === 0) return [];
    
    return [...orders].sort((a, b) => {
      const dateA = new Date(a.orderTime || a.createdAt || 0);
      const dateB = new Date(b.orderTime || b.createdAt || 0);
      return dateB - dateA; // 降序，最新的订单在前
    });
  }, [orders]);

  const handleTimeRangeChange = (dates) => {
    setTimeRange(dates);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      // 构建搜索参数
      const params = {};
      if (timeRange && timeRange[0] && timeRange[1]) {
        params.startTime = timeRange[0].format('YYYY-MM-DD HH:mm:ss');
        params.endTime = timeRange[1].format('YYYY-MM-DD HH:mm:ss');
      }
      if (bookTitle) {
        params.bookTitle = bookTitle;
      }
      
      // 调用搜索API

      const result = await searchOrders(params);
      console.log("result", result);
      updateOrders(result);
    } catch (error) {
      message.error('搜索失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card 
        style={{ marginBottom: 20 }} 
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span><FileTextOutlined /> 订单摘要</span>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleRefresh} 
              loading={refreshing}
              size="small"
            >
              刷新订单
            </Button>
          </div>
        }
        extra={
          lastRefreshTime && <Text type="secondary">上次更新: {lastRefreshTime}</Text>
        }
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Statistic title="用户名" value={user.username} />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Statistic title="订单总数" value={totalOrders} />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Statistic title="总消费" value={totalAmount} prefix="¥" precision={2} />
          </Col>
        </Row>

        {totalOrders > 0 && (
          <>
            <Divider style={{ margin: '12px 0' }} />
            <div>
              <Text strong>订单状态:</Text>{' '}
              {Object.entries(orderStats).map(([status, count]) => (
                <Tag 
                  color={
                    status === 'pending' ? 'blue' : 
                    status === 'paid' ? 'green' : 
                    status === 'shipped' ? 'purple' : 
                    status === 'delivered' ? 'cyan' : 
                    status === 'cancelled' ? 'red' : 'default'
                  } 
                  key={status}
                >
                  {status}: {count}
                </Tag>
              ))}
            </div>
          </>
        )}
      </Card>

      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space>
          <RangePicker 
            style={{ width: 300 }}
            onChange={handleTimeRangeChange}
            placeholder={['开始时间', '结束时间']}
          />
          <Input
            placeholder="请输入书籍名称"
            allowClear
            style={{ width: 200 }}
            onChange={(e) => setBookTitle(e.target.value)}
          />
          <Button 
            type="primary" 
            icon={<SearchOutlined />}
            onClick={handleSearch}
            loading={loading}
          >
            搜索
          </Button>
        </Space>
      </Space>

      <Title level={2}>
        <ShoppingOutlined style={{ marginRight: 10 }} />
        我的订单
      </Title>
      <Divider />
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '30px 0' }}>
          <Spin size="large" tip="加载订单中..." />
        </div>
      ) : sortedOrders && sortedOrders.length > 0 ? (
        <OrderTable orders={sortedOrders} />
      ) : (
        <Empty 
          description="暂无订单记录" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </div>
  );
}
