package bookstore_backend.backend.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * 订单统计DTO - 用于书籍销量统计（热销榜）
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatsDTO {
    private String title;        // 书名
    private Integer sales;       // 销量
    private Double price;        // 单价
    private Double totalAmount;  // 销售总额
} 