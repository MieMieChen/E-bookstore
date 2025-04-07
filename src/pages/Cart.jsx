import React from 'react';
import { 
  Table, 
  Tag, 
  Typography, 
  Button, 
  Card, 
  Row, 
  Col, 
  Space,
  Divider,
  Image
} from 'antd';
import { 
  DeleteOutlined, 
  PlusOutlined, 
  MinusOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ShopOutlined } from '@ant-design/icons';
import { useShop } from '../context/ShopContext';
import Navbar from '../components/Navbar';

const { Title, Text } = Typography;

// 在组件函数顶部定义handleCheckout（return之前）
function Cart() {
  const navigate = useNavigate();
  const { 
    cartItems, 
    removeFromCart, 
    updateCartItemQuantity, 
    getCartTotal,
    createOrder 
  } = useShop();

  const columns = [
    {
      title: '商品',
      dataIndex: 'title',
      key: 'title',
      render: (_, record) => (
        <Space>
          <Image
            width={50}
            src={record.cover}
            alt={record.title}
            preview={false}
          />
          <Text>{record.title}</Text>
        </Space>
      )
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      render: (price) => `¥${price.toFixed(2)}`
    },
    {
      title: '数量',
      key: 'quantity',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button 
            shape="circle" 
            icon={<MinusOutlined />} 
            onClick={() => updateCartItemQuantity(record.id, record.quantity - 1)}
          />
          <Text>{record.quantity}</Text>
          <Button 
            shape="circle" 
            icon={<PlusOutlined />}
            onClick={() => updateCartItemQuantity(record.id, record.quantity + 1)}
          />
        </Space>
      )
    },
    {
      title: '小计',
      key: 'subtotal',
      align: 'right',
      render: (_, record) => `¥${(record.price * record.quantity).toFixed(2)}`
    },
    {
      title: '操作',
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <Button 
          type="link" 
          danger 
          icon={<DeleteOutlined />} 
          onClick={() => removeFromCart(record.id)}
        />
      )
    }
  ];

  // 正确位置：在return语句之前定义函数
  const handleCheckout = () => {
    const total = getCartTotal();
    createOrder(cartItems, total);
    navigate('/orders');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Navbar />
      <div style={{ padding: 24 }}>
        <Title level={2}>购物车</Title>
        <Divider />
        
        <Card>
          <Table
            columns={columns}
            dataSource={cartItems}
            rowKey="id"
            pagination={false}
            locale={{
              emptyText: (
                <Text type="secondary" style={{ padding: 24 }}>
                  购物车是空的
                </Text>
              )
            }}
          />
        </Card>

        <div style={{ 
          marginTop: 24,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}>
          <Text strong style={{ fontSize: 18, marginRight: 24 }}>
            总计: ¥{getCartTotal().toFixed(2)}
          </Text>
          // The checkout button in your cart should look like this:
          <Button 
            type="primary" 
            onClick={handleCheckout}
            icon={<ShopOutlined />}
          >
            去结算
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Cart;