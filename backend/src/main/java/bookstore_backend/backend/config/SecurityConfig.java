package bookstore_backend.backend.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import bookstore_backend.backend.serviceimpl.CustomUserDetailsService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance(); // For development only
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable()) // Disable CSRF for simplicity in this context
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // Create session if needed
                .maximumSessions(1) // Allow only one session per user
                .expiredUrl("/api/auth/login?expired") // Redirect to login if session expires
            )
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Allow all OPTIONS requests
                .requestMatchers("/api/auth/login", "/api/books", "/css/**", "/js/**", "/images/**").permitAll() // Publicly accessible
                .requestMatchers("/api/auth/register").permitAll() // Allow registration
                .requestMatchers("/api/auth/checkLogin").permitAll() // Allow checking login status
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/cart/**", "/api/orders/**", "/api/users/**", "/api/profile/**")
                    .hasAnyRole("USER", "ADMIN")
                .anyRequest().authenticated() // All other requests require authentication
            )
            // .formLogin(form -> form // Configure form-based login
            //     .loginProcessingUrl("/api/auth/login") // URL to submit username and password
            //     .successHandler((request, response, authentication) -> {
            //         // The actual login logic and session creation is handled in AuthServiceimpl
            //         response.setStatus(HttpStatus.OK.value()); 
            //     })
            //     .failureHandler((request, response, exception) -> {
            //         response.setStatus(HttpStatus.UNAUTHORIZED.value());
            //     })
            //     .permitAll() // Allow access to the login page
            // )
            .logout(logout -> logout
                .logoutRequestMatcher(new AntPathRequestMatcher("/api/auth/logout"))
                .logoutSuccessHandler((request, response, authentication) -> {
                    response.setStatus(HttpStatus.OK.value());
                })
                .invalidateHttpSession(true) // Invalidate session on logout
                .deleteCookies("JSESSIONID") // Delete session cookie
                .permitAll()
            )
            .userDetailsService(customUserDetailsService); // Use custom user details service

        return http.build();
    }
}