import {Card, Row, Col, Image, Typography, Space, Tag, Button, Divider} from 'antd';
import { CalendarOutlined, StockOutlined, ShopOutlined, ShoppingCartOutlined } from '@ant-design/icons';
export default function BookCard({book, handleAddToCart}) {
    console.log ("BookCard book:", book);
    return (
        <Card>
            <Row gutter={24}>
                <Col span={8}>
                    <Image 
                        src={book.imageUrl || book.cover} 
                        alt={book.title}
                        style={{ width: '100%', height: 'auto' }}
                    />
                </Col>
                <Col span={16}>
                    <Typography.Title level={2}>{book.title}</Typography.Title>
                    <Typography.Title level={3} type="secondary">
                        ¥{book.price.toFixed(2)}
                    </Typography.Title>
                    
                    <div style={{ marginBottom: 16 }}>
                        <Typography.Text>作者：{book.author}</Typography.Text>
                        <Typography.Text>ISBN：{book.isbn}</Typography.Text>
                        <Typography.Text>出版社：{book.publisher}</Typography.Text>
                        <Typography.Text>描述：{book.description}</Typography.Text>
                        <Typography.Text>出版时间：{book.publish_date}</Typography.Text>

                    </div>
                    
                    <Space size={[8, 16]} wrap>
                        <Tag icon={<CalendarOutlined />}>出版日期：{book.publishDate}</Tag>
                        <Tag 
                            icon={<StockOutlined />}
                            color={book.stock > 0 ? 'success' : 'error'}
                        >
                            库存：{book.stock}本
                        </Tag>
                    </Space>
                    
                    <Divider />
                    
                    <Space>
                        <Button 
                            type="primary" 
                            icon={<ShoppingCartOutlined />} 
                            onClick={handleAddToCart}
                        >
                            加入购物车
                        </Button>
                    </Space>
                </Col>
            </Row>
        </Card>
    );
}