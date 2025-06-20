package bookstore_backend.backend.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * 订单过滤DTO - 用于接收前端的查询条件
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderFilterDTO {
    private String startTime;    // 开始时间
    private String endTime;      // 结束时间
    private Long userId;         // 用户ID（可选，用于个人统计）
} 