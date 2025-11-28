package bookstore_backend.backend.config;

import org.neo4j.driver.Driver;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.neo4j.core.transaction.Neo4jTransactionManager;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import jakarta.persistence.EntityManagerFactory;

/**
 * 多数据源事务管理器配置
 * 配置JPA和Neo4j的事务管理器
 */
@Configuration
@EnableTransactionManagement
public class Neo4jConfig {
    
    /**
     * JPA事务管理器（主要的）
     */
    @Primary
    @Bean(name = "transactionManager")
    public PlatformTransactionManager transactionManager(EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }
    
    /**
     * Neo4j事务管理器
     */
    @Bean(name = "neo4jTransactionManager")
    public PlatformTransactionManager neo4jTransactionManager(@Qualifier("neo4jDriver") Driver driver) {
        return new Neo4jTransactionManager(driver);
    }
}
