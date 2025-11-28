package bookstore_backend.backend.util;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import bookstore_backend.backend.entity.Book;
import bookstore_backend.backend.entity.BookDetails;
import bookstore_backend.backend.repository.BookDetailsRepository;
import bookstore_backend.backend.repository.BookRepository;

/**
 * 数据迁移工具类
 * 将MySQL中的Book表的description字段迁移到MongoDB的BookDetails集合
 * 
 * 注意：这个类只在第一次迁移时运行一次，之后应该注释掉@Component注解
 */
// @Component  // 迁移完成后已注释，避免重复执行
public class BookDescriptionMigrationUtil implements CommandLineRunner {
    
    @Autowired
    private BookRepository bookRepository;
    
    @Autowired
    private BookDetailsRepository bookDetailsRepository;
    
    @Override
    public void run(String... args) throws Exception {
        System.out.println("开始迁移Book表的description字段到MongoDB...");
        
        // 获取所有书籍
        List<Book> allBooks = bookRepository.findAll();
        int migratedCount = 0;
        int skippedCount = 0;
        
        for (Book book : allBooks) {
            try {
                // 检查MongoDB中是否已存在该书籍的详情
                if (bookDetailsRepository.existsByBookId(book.getId())) {
                    System.out.println("跳过书籍 ID: " + book.getId() + " (已存在详情)");
                    skippedCount++;
                } else {
                    // 如果有description数据，创建BookDetails并迁移到MongoDB
                    String description = book.getDescription();
                    if (description != null && !description.isEmpty()) {
                        BookDetails details = new BookDetails(book.getId(), description);
                        bookDetailsRepository.save(details);
                        migratedCount++;
                        System.out.println("已迁移书籍 ID: " + book.getId() + " - " + book.getTitle());
                    } else {
                        System.out.println("跳过书籍 ID: " + book.getId() + " (无description数据)");
                        skippedCount++;
                    }
                }
                
            } catch (Exception e) {
                System.err.println("迁移书籍 ID: " + book.getId() + " 时出错: " + e.getMessage());
            }
        }
        
        System.out.println("迁移完成！");
        System.out.println("成功迁移: " + migratedCount + " 条记录");
        System.out.println("跳过: " + skippedCount + " 条记录");
        System.out.println("总计: " + allBooks.size() + " 条记录");
    }
}
