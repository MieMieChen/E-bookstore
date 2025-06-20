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
    Image,
    Modal,
    message
  } from 'antd';
  import { 
    DeleteOutlined, 
    PlusOutlined, 
    MinusOutlined,
    ShopOutlined
  } from '@ant-design/icons';
  import { useAuth } from '../context/AuthContext';

const { Text } = Typography;

export default function CartItem({
    cartItems,
    removeFromCart, 
    updateCartItemQuantity, 
    getCartTotal,
    createOrder,
    navigate
}) {

    
    // 获取认证上下文
    const { getMe,currentUser } = useAuth();

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
                disabled={record.quantity <= 1}
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
    
      const handleCheckout = async () => {
        try {
          const total = getCartTotal();
          
          if (!cartItems || cartItems.length === 0) {
            Modal.error({
              title: '购物车错误',
              content: '购物车为空，无法结算'
            });
            return;
          }
          
          // 检查cartItems的格式是否正确
          const validItems = cartItems.filter(item => 
            item && item.id && typeof item.quantity === 'number' && item.price 
          );
          
          if (validItems.length !== cartItems.length) {
            Modal.error({
              title: '购物车错误',
              content: '购物车中存在无效商品项'
            });
            return;
          }
          
          // 创建订单
          const result = await createOrder(validItems, total);
          
          // 如果返回null，说明创建订单失败（可能是因为商品下架等原因）
          // createOrder函数内部会显示相应的错误弹窗
          if (!result) {
            return;
          }

          // 订单创建成功
          Modal.success({
            title: '订单创建成功',
            content: '即将跳转到订单页面',
            onOk: () => navigate('/orders')
          });
        } catch (error) {
          console.error('结算错误:', error);
          Modal.error({
            title: '系统错误',
            content: '结算过程中发生错误，请稍后重试'
          });
        }
      };

      return (
        <>
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
                <Button 
                    type="primary" 
                    onClick={handleCheckout}
                    icon={<ShopOutlined />}
                    disabled={cartItems.length === 0}
                >
                    去结算
                </Button>
            </div>
        </>
      );
}
//在 JavaScript 中，return 语句后面的括号是很重要的，这涉及到 JavaScript 的"自动分号插入"（Automatic Semicolon Insertion，ASI）机制。
// 如果不加（）；就相当于 return ； 后面的都不会返回了！！