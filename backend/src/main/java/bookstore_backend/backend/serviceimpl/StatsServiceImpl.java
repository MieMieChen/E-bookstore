package bookstore_backend.backend.serviceimpl;

import bookstore_backend.backend.service.StatsService;
import bookstore_backend.backend.dto.OrderStatsDTO;
import bookstore_backend.backend.dto.OrderFilterDTO;
import bookstore_backend.backend.dto.UserStatsDTO;
import bookstore_backend.backend.entity.Order;
import bookstore_backend.backend.entity.OrderItem;
import bookstore_backend.backend.entity.User;
import bookstore_backend.backend.dao.OrderDao;
import bookstore_backend.backend.dao.UserDao;
import bookstore_backend.backend.entity.OrderStatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 统计服务实现类
 */
@Service
public class StatsServiceImpl implements StatsService {

    @Autowired
    private OrderDao orderDao;
    
    @Autowired
    private UserDao userDao;

    @Override
    public List<OrderStatsDTO> getBookSalesStats(OrderFilterDTO filter) {
        // 1. 根据过滤条件查询订单
        List<Order> orders = getOrdersByFilter(filter);
        System.out.println("查询到的订单数量: " + orders.size());
        
        // 2. 统计每本书的销量和销售总额（排除已取消的订单）
        Map<String, BookSalesStat> bookStats = orders.stream()
            .filter(order -> {
                boolean isNotCancelled = order.getStatus() != OrderStatus.CANCELLED;
                System.out.println("订单 " + order.getId() + " 状态: " + order.getStatus() + ", 是否计入统计: " + isNotCancelled);
                return isNotCancelled;
            })
            .flatMap(order -> order.getOrderItems().stream())
            .collect(Collectors.groupingBy(
                item -> item.getBook().getTitle(),
                Collectors.collectingAndThen(
                    Collectors.toList(),
                    items -> {
                        BookSalesStat stat = new BookSalesStat();
                        stat.sales = items.stream().mapToInt(OrderItem::getQuantity).sum();
                        stat.price = items.get(0).getBook().getPrice(); // 假设同一本书的价格不变
                        stat.totalAmount = items.stream()
                            .mapToDouble(item -> item.getQuantity() * item.getBook().getPrice())
                            .sum();
                        return stat;
                    }
                )
            ));
        
        System.out.println("统计结果: " + bookStats);
        
        // 3. 转换为DTO并按销量排序
        return bookStats.entrySet().stream()
            .map(entry -> OrderStatsDTO.builder()
                .title(entry.getKey())
                .sales(entry.getValue().sales)
                .price(entry.getValue().price)
                .totalAmount(entry.getValue().totalAmount)
                .build())
            .sorted((a, b) -> b.getSales().compareTo(a.getSales())) // 按销量降序
            .collect(Collectors.toList());
    }

    // 用于临时存储书籍销售统计信息的内部类
    private static class BookSalesStat {
        int sales;          // 销量
        double price;       // 单价
        double totalAmount; // 销售总额
    }

    @Override
    public List<UserStatsDTO> getUserConsumeStats(OrderFilterDTO filter) {
        // 1. 获取所有用户
        List<User> allUsers = userDao.findAll();
        System.out.println("总用户数: " + allUsers.size());

        // 2. 根据过滤条件查询订单
        List<Order> orders = getOrdersByFilter(filter);
        System.out.println("查询到的订单数量: " + orders.size());
        
        // 3. 统计每个用户的消费总额（排除已取消的订单）
        Map<String, Double> userConsume = orders.stream()
            .filter(order -> {
                boolean isNotCancelled = order.getStatus() != OrderStatus.CANCELLED;
                System.out.println("订单 " + order.getId() + " 状态: " + order.getStatus() + ", 是否计入统计: " + isNotCancelled);
                return isNotCancelled;
            })
            .collect(Collectors.groupingBy(
                order -> order.getUser().getUsername(),
                Collectors.summingDouble(order -> order.getTotalAmount().doubleValue())
            ));
        
        // 4. 确保所有用户都在统计中，没有订单的用户消费金额为0
        List<UserStatsDTO> result = allUsers.stream()
            .map(user -> UserStatsDTO.builder()
                .username(user.getUsername())
                .total(userConsume.getOrDefault(user.getUsername(), 0.0))
                .build())
            .sorted((a, b) -> b.getTotal().compareTo(a.getTotal())) // 按消费额降序
            .collect(Collectors.toList());

        System.out.println("统计结果: " + result);
        return result;
    }

    @Override
    public List<UserStatsDTO> getUserBookStats(OrderFilterDTO filter) {
        // 1. 根据过滤条件查询订单（包含用户ID过滤）
        List<Order> orders = getOrdersByFilter(filter);
        System.out.println("查询到的订单数量: " + orders.size());
        
        // 2. 统计用户购买的每本书的数量和总金额（排除已取消的订单）
        Map<String, BookSalesStat> userBookStats = orders.stream()
            .filter(order -> {
                boolean isNotCancelled = order.getStatus() != OrderStatus.CANCELLED;
                System.out.println("订单 " + order.getId() + " 状态: " + order.getStatus() + ", 是否计入统计: " + isNotCancelled);
                return isNotCancelled;
            })
            .flatMap(order -> order.getOrderItems().stream())
            .collect(Collectors.groupingBy(
                item -> item.getBook().getTitle(),
                Collectors.collectingAndThen(
                    Collectors.toList(),
                    items -> {
                        BookSalesStat stat = new BookSalesStat();
                        stat.sales = items.stream().mapToInt(OrderItem::getQuantity).sum();
                        stat.price = items.get(0).getBook().getPrice(); // 假设同一本书的价格不变
                        stat.totalAmount = items.stream()
                            .mapToDouble(item -> item.getQuantity() * item.getBook().getPrice())
                            .sum();
                        return stat;
                    }
                )
            ));
        
        System.out.println("统计结果: " + userBookStats);
        
        // 3. 转换为DTO
        return userBookStats.entrySet().stream()
            .map(entry -> UserStatsDTO.builder()
                .title(entry.getKey())
                .count(entry.getValue().sales)
                .price(entry.getValue().price)
                .total(entry.getValue().totalAmount)
                .build())
            .collect(Collectors.toList());
    }

    /**
     * 根据过滤条件查询订单
     */
    private List<Order> getOrdersByFilter(OrderFilterDTO filter) {
        LocalDateTime startTime = parseDateTime(filter.getStartTime());
        LocalDateTime endTime = parseDateTime(filter.getEndTime());
        
        System.out.println("查询时间范围: " + startTime + " 到 " + endTime);
        
        // 如果是用户个人统计，则只查询该用户的订单；否则查询所有订单
        List<Order> orders;
        boolean isPersonalStats = filter.getIsPersonalStats() != null && filter.getIsPersonalStats();
        if (filter.getUserId() != null && isPersonalStats) {
            orders = orderDao.findByUserIdAndTimeRange(filter.getUserId(), startTime, endTime);
        } else {
            orders = orderDao.findByTimeRange(startTime, endTime);
        }
        
        System.out.println("查询到订单数量: " + orders.size());
        return orders;
    }

    /**
     * 解析时间字符串
     */
    private LocalDateTime parseDateTime(String dateTimeStr) {
        if (dateTimeStr == null || dateTimeStr.isEmpty()) {
            return LocalDateTime.now().minusDays(30); // 默认查询最近30天
        }
        
        try {
            // 解析日期
            LocalDate date = LocalDate.parse(dateTimeStr, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            // 如果是开始时间，设置为当天的开始；如果是结束时间，设置为当天的结束
            return date.atStartOfDay();
        } catch (Exception e) {
            System.err.println("日期解析错误: " + e.getMessage());
            e.printStackTrace();
            return LocalDateTime.now().minusDays(30);
        }
    }
} 