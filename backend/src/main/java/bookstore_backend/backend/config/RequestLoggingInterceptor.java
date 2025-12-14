package bookstore_backend.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class RequestLoggingInterceptor implements HandlerInterceptor {

    @Value("${server.port}")
    private String serverPort;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String method = request.getMethod();
        String uri = request.getRequestURI();
        
        // 输出带颜色的日志，方便区分
        System.out.println("\n" +
            "========================================\n" +
            "🚀 [PORT " + serverPort + "] 处理请求\n" +
            "📍 " + method + " " + uri + "\n" +
            "========================================\n");
        
        return true;
    }
}
