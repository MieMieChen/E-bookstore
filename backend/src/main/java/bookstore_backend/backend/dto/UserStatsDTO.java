package bookstore_backend.backend.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * 用户统计DTO - 用于用户消费统计（消费榜）和个人购书统计
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsDTO {
    private String username;     // 用户名（用于消费榜）
    private Double total;        // 消费总额
    private String title;        // 书名（用于个人购书统计）
    private Integer count;       // 购买数量（用于个人购书统计）
    private Double price;        // 单价（用于个人购书统计）
} 