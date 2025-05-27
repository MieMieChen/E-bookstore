package bookstore_backend.backend.entity;

public enum OrderStatus {
    PENDING,    // 待付款
    PAID,       // 已付款
    SHIPPED,    // 已发货
    DELIVERED,  // 已送达
    CANCELLED   // 已取消
} 