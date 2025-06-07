package bookstore_backend.backend.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import bookstore_backend.backend.serviceimpl.CustomUserDetailsService;



// BCrypt 的工作原理：
// 存储密码时：
// BCrypt 生成一个随机的 salt
// 将 salt 和密码组合进行多轮哈希运算
// 最终存储的格式是：$2a$10$salt+hash
// 其中 $2a$ 是版本标识，10 是工作因子（计算强度）
// 验证密码时：
// 从数据库中读取的哈希值包含了 salt 信息
// BCrypt 从这个哈希值中提取 salt
// 用相同的 salt 对用户输入的密码进行相同的哈希运算
// 比较计算结果是否与存储的哈希值匹配
// 这就是为什么：
// 每次对同一个密码加密，得到的哈希值都不同（因为 salt 是随机的）
// 但是验证时却能正确匹配（因为 salt 被保存在哈希值中）
// 即使两个用户使用相同的密码，存储的哈希值也不同（因为 salt 不同）
// 这种设计大大提高了安全性，因为：
// 即使数据库被泄露，攻击者也无法通过彩虹表破解密码
// 由于每个用户的 salt 都不同，无法通过批量计算来破解多个用户的密码
// 工作因子可以调整，随着计算机性能提升可以增加计算强度
// 使用这些完全相同的参数对用户输入的明文密码进行哈希：
// 使用相同的算法版本
// 使用相同的工作因子
// 使用相同的 salt
// 比较计算结果是否与存储的哈希值匹配


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // 
    } 

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfiguration) throws Exception {
        return authConfiguration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // Frontend URL
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true); // Important for cookies
        configuration.setMaxAge(3600L); // 1 hour

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable()) // Disable CSRF for simplicity in this context
            .authenticationProvider(authenticationProvider()) // 添加认证提供者
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // Create session if needed
                .maximumSessions(1) // Allow only one session per user
                .expiredUrl("/api/auth/login?expired") // Redirect to login if session expires
            )
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Allow all OPTIONS requests
                .requestMatchers("/api/auth/login", "/api/auth/me", "/api/books", "/css/**", "/js/**", "/images/**").permitAll() // Publicly accessible
                .requestMatchers("/api/auth/register").permitAll() // Allow registration
                .requestMatchers("/api/auth/migrate-passwords-test").permitAll() // Allow password migration test
                .requestMatchers("/api/auth/checkLogin").permitAll() // Allow checking login status
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/cart/**", "/api/orders/**", "/api/users/**", "/api/profile/**")
                    .hasAnyRole("USER", "ADMIN")
                .anyRequest().authenticated() // All other requests require authentication
            )
            .logout(logout -> logout
                .logoutRequestMatcher(new AntPathRequestMatcher("/api/auth/logout"))
                .logoutSuccessHandler((request, response, authentication) -> {
                    response.setStatus(HttpStatus.OK.value());
                })
                .invalidateHttpSession(true) // Invalidate session on logout
                .deleteCookies("JSESSIONID", "currentUser") // Delete both session and auth cookies
                .permitAll()
            )
            .userDetailsService(customUserDetailsService);

        return http.build();
    }
}