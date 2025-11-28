package bookstore_backend.backend.util;

import bookstore_backend.backend.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Neo4j标签图初始化工具
 * 应用启动时自动执行，创建标签层次结构
 */
@Component
public class TagGraphInitializer implements CommandLineRunner {
    
    @Autowired
    private TagService tagService;
    
    @Override
    public void run(String... args) throws Exception {
        System.out.println("检查Neo4j标签图...");
        try {
            tagService.initializeTagGraph();
        } catch (Exception e) {
            System.err.println("标签图初始化失败: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
