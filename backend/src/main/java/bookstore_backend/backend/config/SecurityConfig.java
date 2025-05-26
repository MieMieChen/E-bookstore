package bookstore_backend.backend.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource; // 导入
import org.springframework.web.cors.UrlBasedCorsConfigurationSource; // 导入
import org.springframework.http.HttpMethod;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import bookstore_backend.backend.serviceimpl.CustomUserDetailsService;
import bookstore_backend.backend.dao.UserDao;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;


import java.util.List;

@Configuration
@EnableWebSecurity 
public class SecurityConfig{

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    // 1. 配置密码编码器
    @Bean
    public PasswordEncoder passwordEncoder() {
        // 开发环境下使用明文密码（不安全，生产环境请用BCryptPasswordEncoder）
        return NoOpPasswordEncoder.getInstance();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // 设置允许的前端源。确保这里是你的前端应用的实际端口和协议。
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        // 设置允许的 HTTP 方法，POST 和 OPTIONS 是必须的
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // 设置允许的请求头，"*" 表示允许所有
        configuration.setAllowedHeaders(List.of("*"));
        // 允许发送认证凭据（如 Cookie，用于 Session 认证）
        configuration.setAllowCredentials(true);
        // 预检请求的缓存时间，单位秒 (例如 1 小时)
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // 将此 CORS 配置应用于所有路径
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    // 2. 配置 HTTP 安全规则
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors().and()
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) 
                .sessionFixation().migrateSession() 
            )
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/auth/login","/api/books","/css/**", "/js/**", "/images/**").permitAll() // 修正路径
                // .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()// 其他请求需要认证
            )
            // .formLogin()
            // .successHandler(authenticationSuccessManager())
            // .failureHandler(authenticationFailureManager())
            .logout(logout -> logout
                // 注销请求的 URL
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                // 注销成功后重定向的 URL
                .logoutSuccessUrl("/login?logout")
                // 清除认证信息和使会话失效
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID") // 删除 JSESSIONID Cookie
                .permitAll()
            )
            .csrf(csrf -> csrf.disable()); // 禁用 CSRF 防护，开发环境方便，生产环境请根据需求开启
    
        return http.build();
    }

    public Authentication authenticate(Authentication authentication) throws AuthenticationException
    {
        String username = authentication.getName();
        String password = authentication.getCredentials().toString();
        // 这里可以添加自定义的认证逻辑
        UserDetails user = customUserDetailsService.loadUserByUsername(username);
        if(passwordEncoder().matches(password, user.getPassword()))
            return new UsernamePasswordAuthenticationToken(
                user, password, user.getAuthorities()
            );
        else
        {
            throw new BadCredentialsException("The password is incorrect");
        }

    }
}