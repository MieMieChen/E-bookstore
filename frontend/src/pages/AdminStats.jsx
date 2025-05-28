import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Button, Table, DatePicker, Select, message } from 'antd';
import { UserOutlined, DollarOutlined, BookOutlined, ShoppingCartOutlined, FileProtectOutlined } from '@ant-design/icons';
import{useAuth} from "../context/AuthContext";

export function AdminStatsPage() {
    const {currentUser} = useAuth();
    const isAdmin = currentUser.type;
    return (
        // isAdmin? 要区分是什么身份 给出不一样的页面

        <div>
            <h1>统计分析</h1>
        </div>
    )
}
