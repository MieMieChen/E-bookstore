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
    console.log(cartItems);
    console.log(removeFromCart);
    console.log(updateCartItemQuantity);
    console.log(getCartTotal);
    console.log(createOrder);
    
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
          // 获取总金额
          const total = getCartTotal();
          
          // 记录当前购物车中的所有商品ID和信息
          console.log('结算的购物车内容:', JSON.stringify(cartItems, null, 2));
          
          if (!cartItems || cartItems.length === 0) {
            console.error('购物车为空，无法结算');
            return;
          }
          
          // 1. 创建订单
          console.log('正在创建订单...');
          
          // 检查cartItems的格式是否正确
          const validItems = cartItems.filter(item => 
            item && item.id && typeof item.quantity === 'number' && item.price
          );
          
          if (validItems.length !== cartItems.length) {
            console.error('购物车中存在无效商品项:', 
              cartItems.filter(item => !(item && item.id && typeof item.quantity === 'number' && item.price))
            );
          }
          
          try {
            // 这里的createOrder会在内部处理订单创建和状态更新，只需调用一次
            const order = await createOrder(validItems, total);
            console.log('订单创建成功:', order);
            
            // 2. 确保数据库购物车被清空（以防后端逻辑未清空）
            const user = await getMe();
            console.log('当前用户:', user);
            
            // 使用fetch API直接发送删除请求
            await fetch(`http://localhost:8080/api/cart/user/${user.id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json'
              }
            });
            console.log('已发送额外的购物车清空请求，确保数据库同步');
            
            // 3. 最后跳转到订单页面
            navigate('/orders');
          } catch (orderError) {
            console.error('创建订单时出错:', orderError);
            // 出错时也跳转，但显示错误信息
            alert(`创建订单失败: ${orderError.message || '未知错误'}`);
            navigate('/orders');
          }
        } catch (error) {
          console.error('结算过程中发生致命错误:', error);
          alert('结算过程中发生错误，请稍后再试');
          navigate('/cart');
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