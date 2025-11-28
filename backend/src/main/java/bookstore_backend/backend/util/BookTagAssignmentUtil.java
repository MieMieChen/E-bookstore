package bookstore_backend.backend.util;

import bookstore_backend.backend.entity.Book;
import bookstore_backend.backend.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 为书籍分配标签的工具类
 * 根据书籍的标题和内容智能分配标签
 * 
 * 注意：只在第一次运行时启用，之后应注释掉@Component
 */
@Component
@Order(2) // 确保在TagGraphInitializer之后运行
public class BookTagAssignmentUtil implements CommandLineRunner {
    
    @Autowired
    private BookRepository bookRepository;
    
    @Override
    public void run(String... args) throws Exception {
        System.out.println("开始为书籍分配标签...");
        
        List<Book> allBooks = bookRepository.findAll();
        int assignedCount = 0;
        
        for (Book book : allBooks) {
            try {
                // 如果书籍已有标签，跳过
                if (book.getTags() != null && !book.getTags().isEmpty()) {
                    System.out.println("书籍 " + book.getTitle() + " 已有标签，跳过");
                    continue;
                }
                
                // 根据书籍标题和描述智能分配标签
                String tags = assignTagsBasedOnBook(book);
                
                if (tags != null && !tags.isEmpty()) {
                    book.setTags(tags);
                    bookRepository.save(book);
                    assignedCount++;
                    System.out.println("为书籍 " + book.getTitle() + " 分配标签: " + tags);
                }
                
            } catch (Exception e) {
                System.err.println("为书籍 " + book.getId() + " 分配标签时出错: " + e.getMessage());
            }
        }
        
        System.out.println("标签分配完成！共分配 " + assignedCount + " 本书");
    }
    
    /**
     * 根据书籍信息智能分配标签
     */
    private String assignTagsBasedOnBook(Book book) {
        String title = book.getTitle() != null ? book.getTitle().toLowerCase() : "";
        String author = book.getAuthor() != null ? book.getAuthor().toLowerCase() : "";
        String description = book.getDescription() != null ? book.getDescription().toLowerCase() : "";
        
        StringBuilder tags = new StringBuilder();
        
        // 检测科幻相关
        if (containsAny(title + description, "科幻", "太空", "宇宙", "外星", "星际", "未来", "机器人")) {
            addTag(tags, "科幻,小说");
            if (containsAny(title + description, "太空", "星际", "宇宙")) {
                addTag(tags, "太空歌剧");
            }
            if (containsAny(title + description, "赛博", "网络", "黑客")) {
                addTag(tags, "赛博朋克");
            }
        }
        
        // 检测奇幻相关
        else if (containsAny(title + description, "奇幻", "魔法", "精灵", "龙", "剑", "魔幻")) {
            addTag(tags, "奇幻,小说");
        }
        
        // 检测悬疑推理
        else if (containsAny(title + description, "悬疑", "推理", "侦探", "谋杀", "案件", "破案")) {
            addTag(tags, "悬疑,小说");
        }
        
        // 检测历史相关
        else if (containsAny(title + description, "历史", "古代", "王朝", "帝国", "战争")) {
            addTag(tags, "历史,小说");
        }
        
        // 检测编程相关
        else if (containsAny(title + description, "编程", "程序", "代码", "开发", "软件")) {
            addTag(tags, "编程,科技");
            if (containsAny(title + description, "java")) {
                addTag(tags, "Java");
            }
            if (containsAny(title + description, "python")) {
                addTag(tags, "Python");
            }
            if (containsAny(title + description, "web", "网页", "前端", "后端")) {
                addTag(tags, "Web开发");
            }
        }
        
        // 检测人工智能
        else if (containsAny(title + description, "人工智能", "机器学习", "深度学习", "神经网络", "ai")) {
            addTag(tags, "人工智能,科技");
        }
        
        // 检测哲学相关
        else if (containsAny(title + description, "哲学", "思想", "存在", "本质")) {
            addTag(tags, "哲学,人文");
        }
        
        // 检测心理学
        else if (containsAny(title + description, "心理", "心理学", "精神", "认知")) {
            addTag(tags, "心理学,人文");
        }
        
        // 检测经济学
        else if (containsAny(title + description, "经济", "金融", "投资", "市场", "商业")) {
            addTag(tags, "经济学,人文");
        }
        
        // 检测传记
        else if (containsAny(title + description, "传", "自传", "回忆录") || 
                 containsAny(author, "传")) {
            addTag(tags, "传记,非小说");
        }
        
        // 检测艺术相关
        else if (containsAny(title + description, "音乐", "绘画", "摄影", "艺术", "美术")) {
            if (containsAny(title + description, "音乐")) {
                addTag(tags, "音乐,艺术");
            } else if (containsAny(title + description, "绘画", "美术")) {
                addTag(tags, "绘画,艺术");
            } else if (containsAny(title + description, "摄影")) {
                addTag(tags, "摄影,艺术");
            } else {
                addTag(tags, "艺术");
            }
        }
        
        // 默认标签
        if (tags.length() == 0) {
            addTag(tags, "图书");
        }
        
        return tags.toString();
    }
    
    /**
     * 检查文本是否包含任意关键词
     */
    private boolean containsAny(String text, String... keywords) {
        for (String keyword : keywords) {
            if (text.contains(keyword.toLowerCase())) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * 添加标签（避免重复）
     */
    private void addTag(StringBuilder tags, String newTag) {
        if (tags.length() > 0) {
            tags.append(",");
        }
        tags.append(newTag);
    }
}
