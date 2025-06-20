package bookstore_backend.backend.service;

import bookstore_backend.backend.dto.OrderStatsDTO;
import bookstore_backend.backend.dto.UserStatsDTO;
import bookstore_backend.backend.dto.OrderFilterDTO;
import java.util.List;

/**
 * 统计服务接口
 */
public interface StatsService {
    
    /**
     * 获取书籍销量统计（热销榜）
     */
    List<OrderStatsDTO> getBookSalesStats(OrderFilterDTO filter);
    
    /**
     * 获取用户消费统计（消费榜）
     */
    List<UserStatsDTO> getUserConsumeStats(OrderFilterDTO filter);
    
    /**
     * 获取用户个人购书统计
     */
    List<UserStatsDTO> getUserBookStats(OrderFilterDTO filter);
} 