import React, { useState, useEffect, useMemo } from 'react';
import { Card, Table, DatePicker, Row, Col, Statistic, Spin } from 'antd';
import { BookOutlined, DollarOutlined } from '@ant-design/icons';
import { getUserStats } from '../services/user';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

export function UserStatsPage (){
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState([]);
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, 'days'),
    dayjs()
  ]);

  const columns = [
    {
      title: '书名',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `¥${price.toFixed(2)}`,
    },
    {
      title: '购买数量',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: '总金额',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `¥${total.toFixed(2)}`,
    },
  ];

  // 计算总计信息
  const totals = useMemo(() => ({
    totalBooks: stats.reduce((sum, item) => sum + (item.count || 0), 0),
    totalAmount: stats.reduce((sum, item) => sum + (item.total || 0), 0),
  }), [stats]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [startTime, endTime] = dateRange;
      const data = await getUserStats({
        startTime: startTime.format('YYYY-MM-DD'),
        endTime: endTime.format('YYYY-MM-DD'),
      });
      setStats(data);
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
    <Card
      title="我的购书统计"
      extra={
        <RangePicker
          value={dateRange}
          onChange={setDateRange}
          allowClear={false}
        />
      }
    >
      {loading ? (
        <Spin />
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={stats}
            rowKey="title"
            pagination={false}
            style={{ marginBottom: 24 }}
          />
          <Row gutter={16}>
            <Col span={12}>
              <Statistic
                title="购书总本数"
                value={totals.totalBooks}
                prefix={<BookOutlined />}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="消费总金额"
                value={totals.totalAmount}
                prefix={<DollarOutlined />}
                suffix="¥"
              />
            </Col>
          </Row>
        </>
      )}
    </Card>
  );
};

