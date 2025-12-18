// 创建新文件 backend/src/main/java/bookstore_backend/backend/config/WebConfig.java
package bookstore_backend.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//这是一个 Spring Boot 后端配置类，主要用于配置拦截器
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private RequestLoggingInterceptor requestLoggingInterceptor;

    // CORS 配置已移至 SecurityConfig.java，避免重复配置

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 添加请求日志拦截器，拦截所有 /api/ 开头的请求
        registry.addInterceptor(requestLoggingInterceptor)
                .addPathPatterns("/api/**");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 排除 /graphql 路径，避免被当作静态资源处理
        // GraphQL 端点由 Spring GraphQL 自动处理
    }
}