import React, { useState, useEffect, useMemo } from 'react';
import { Card, Table, DatePicker, Tabs, Row, Col, Statistic, Spin, Avatar } from 'antd';
import { BookOutlined, DollarOutlined, UserOutlined, ShoppingOutlined, CrownOutlined } from '@ant-design/icons';
import { Bar } from '@ant-design/charts';
import { getAdminBookStats, getAdminUserStats } from '../services/user';
import dayjs from 'dayjs';
import styled from 'styled-components';

const { RangePicker } = DatePicker;

// 样式组件
const StatsCard = styled(Card)`
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  
  .ant-card-head {
    border-bottom: none;
  }
`;

const OverviewCard = styled(Card)`
  border-radius: 12px;
  background: ${props => props.bgcolor};
  color: white;
  margin-bottom: 24px;
  
  .ant-statistic-title, .ant-statistic-content {
    color: white !important;
  }
  
  .ant-card-body {
    padding: 20px;
  }
`;

const TopUserCard = styled(Card)`
  border-radius: 12px;
  text-align: center;
  background: ${props => props.bgcolor || 'white'};
  margin: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  
  .rank-number {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
    color: ${props => props.rankColor || '#666'};
  }
  
  .user-avatar {
    margin-bottom: 12px;
  }
  
  .username {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 8px;
  }
  
  .user-id {
    color: #999;
    font-size: 12px;
  }
`;

export function AdminStatsPage() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('users'); // 默认显示用户统计
  const [bookStats, setBookStats] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, 'days'),
    dayjs()
  ]);

  // 计算统计数据
  const stats = useMemo(() => ({
    activeUsers: userStats.length,
    totalAmount: userStats.reduce((sum, item) => sum + (item.total || 0), 0),
    averageAmount: userStats.length ? 
      userStats.reduce((sum, item) => sum + (item.total || 0), 0) / userStats.length : 0,
    totalOrders: bookStats.reduce((sum, item) => sum + (item.sales || 0), 0),
  }), [userStats, bookStats]);

  // 获取前三名用户
  const topUsers = useMemo(() => 
    userStats.slice(0, 3).map((user, index) => ({
      ...user,
      rank: index + 1,
      bgcolor: index === 0 ? '#FFF9E6' : index === 1 ? '#F6F7FF' : '#FFF1F0',
      rankColor: index === 0 ? '#FFB800' : index === 1 ? '#6B7AFF' : '#FF6B84',
    })),
    [userStats]
  );

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [startTime, endTime] = dateRange;
      const params = {
        startTime: startTime.format('YYYY-MM-DD'),
        endTime: endTime.format('YYYY-MM-DD'),
      };

      const [bookData, userData] = await Promise.all([
        getAdminBookStats(params),
        getAdminUserStats(params),
      ]);
      
      setBookStats(bookData);
      setUserStats(userData);
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  return (
    <div style={{ padding: '24px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <h2 style={{ margin: 0 }}>
            {activeTab === 'users' ? '用户消费分析与消费榜' : '图书销售分析与热销榜'}
          </h2>
        </Col>
        <Col>
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            allowClear={false}
            style={{ width: 320 }}
          />
        </Col>
      </Row>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* 统计概览 */}
          <Row gutter={16}>
            <Col span={6}>
              <OverviewCard bgcolor="#6B7AFF">
                <Statistic
                  title="活跃用户数"
                  value={stats.activeUsers}
                  prefix={<UserOutlined />}
                  suffix="人"
                />
              </OverviewCard>
            </Col>
            <Col span={6}>
              <OverviewCard bgcolor="#FF6B84">
                <Statistic
                  title="总消费金额"
                  value={stats.totalAmount}
                  prefix={<DollarOutlined />}
                  suffix="元"
                  precision={2}
                />
              </OverviewCard>
            </Col>
            <Col span={6}>
              <OverviewCard bgcolor="#36CFC9">
                <Statistic
                  title="平均消费"
                  value={stats.averageAmount}
                  prefix={<DollarOutlined />}
                  suffix="元"
                  precision={2}
                />
              </OverviewCard>
            </Col>
            <Col span={6}>
              <OverviewCard bgcolor="#73D13D">
                <Statistic
                  title="总订单数"
                  value={stats.totalOrders}
                  prefix={<ShoppingOutlined />}
                  suffix="个"
                />
              </OverviewCard>
            </Col>
          </Row>

          {/* 消费榜 TOP3 */}
          {activeTab === 'users' && (
            <StatsCard title={<><CrownOutlined /> 消费榜 TOP3</>}>
              <Row justify="center">
                {topUsers.map(user => (
                  <Col span={8} key={user.username}>
                    <TopUserCard bgcolor={user.bgcolor}>
                      <div className="rank-number" style={{ color: user.rankColor }}>
                        #{user.rank}
                      </div>
                      <Avatar
                        size={64}
                        icon={<UserOutlined />}
                        className="user-avatar"
                      />
                      <div className="username">{user.username}</div>
                      {/* <div className="user-id">用户ID: {user.userId || 'N/A'}</div> */}
                      <Statistic
                        value={user.total}
                        prefix="¥"
                        precision={2}
                        valueStyle={{ color: user.rankColor, fontSize: '20px' }}
                      />
                    </TopUserCard>
                  </Col>
                ))}
              </Row>
            </StatsCard>
          )}

          {/* 图表和表格展示 */}
          <StatsCard>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                {
                  key: 'users',
                  label: '用户消费统计',
                  children: (
                        <Table
                          columns={[
                            {
                              title: '用户名',
                              dataIndex: 'username',
                              key: 'username',
                            },
                            {
                              title: '消费总额',
                              dataIndex: 'total',
                              key: 'total',
                              render: (total) => `¥${total.toFixed(2)}`,
                              sorter: (a, b) => b.total - a.total,
                            },
                          ]}
                          dataSource={userStats}
                          rowKey="username"
                          pagination={{ pageSize: 5 }}
                        />
                  ),
                },
                {
                  key: 'books',
                  label: '图书销售统计',
                  children: (
                        <Table
                          columns={[
                            {
                              title: '书名',
                              dataIndex: 'title',
                              key: 'title',
                            },
                            {
                              title: '销量',
                              dataIndex: 'sales',
                              key: 'sales',
                              sorter: (a, b) => b.sales - a.sales,
                            },
                            {
                              title: '销售总额',
                              dataIndex: 'totalAmount',
                              key: 'totalAmount',
                              render: (total) => `¥${total.toFixed(2)}`,
                              sorter: (a, b) => b.totalAmount - a.totalAmount,
                            },
                          ]}
                          dataSource={bookStats}
                          rowKey="title"
                          pagination={{ pageSize: 5 }}
                        />
                  ),
                },
              ]}
            />
          </StatsCard>
        </>
      )}
    </div>
  );
}

