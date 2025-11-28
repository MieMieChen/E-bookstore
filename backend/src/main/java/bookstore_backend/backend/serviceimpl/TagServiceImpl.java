package bookstore_backend.backend.serviceimpl;

import bookstore_backend.backend.entity.Book;
import bookstore_backend.backend.entity.Tag;
import bookstore_backend.backend.repository.BookRepository;
import bookstore_backend.backend.repository.TagRepository;
import bookstore_backend.backend.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * TagServiceImpl - 标签服务实现类
 */
@Service
public class TagServiceImpl implements TagService {
    
    @Autowired
    private TagRepository tagRepository;
    
    @Autowired
    private BookRepository bookRepository;
    
    @Override
    @Transactional("neo4jTransactionManager")
    public void initializeTagGraph() {
        // 检查是否已经初始化
        if (tagRepository.existsByName("图书")) {
            System.out.println("标签图已存在，跳过初始化");
            return;
        }
        
        System.out.println("开始初始化标签图...");
        
        // 1. 创建根节点"图书"
        Tag root = createTag("图书", 0, "所有图书的根分类");
        
        // 2. 创建一级分类
        Tag fiction = createTag("小说", 1, "小说类图书");
        Tag nonFiction = createTag("非小说", 1, "非小说类图书");
        Tag technology = createTag("科技", 1, "科技类图书");
        Tag humanities = createTag("人文", 1, "人文社科类图书");
        Tag arts = createTag("艺术", 1, "艺术类图书");
        
        // 3. 创建二级分类 - 小说子分类
        Tag sciFi = createTag("科幻", 2, "科幻小说");
        Tag fantasy = createTag("奇幻", 2, "奇幻小说");
        Tag mystery = createTag("悬疑", 2, "悬疑推理小说");
        Tag romance = createTag("言情", 2, "言情小说");
        Tag historical = createTag("历史", 2, "历史小说");
        Tag thriller = createTag("惊悚", 2, "惊悚小说");
        
        // 4. 创建二级分类 - 非小说子分类
        Tag biography = createTag("传记", 2, "人物传记");
        Tag essay = createTag("散文", 2, "散文随笔");
        Tag documentary = createTag("纪实", 2, "纪实文学");
        
        // 5. 创建二级分类 - 科技子分类
        Tag programming = createTag("编程", 2, "计算机编程");
        Tag ai = createTag("人工智能", 2, "人工智能与机器学习");
        Tag physics = createTag("物理", 2, "物理学");
        Tag mathematics = createTag("数学", 2, "数学");
        Tag biology = createTag("生物", 2, "生物学");
        
        // 6. 创建二级分类 - 人文子分类
        Tag philosophy = createTag("哲学", 2, "哲学思想");
        Tag psychology = createTag("心理学", 2, "心理学");
        Tag sociology = createTag("社会学", 2, "社会学");
        Tag economics = createTag("经济学", 2, "经济学");
        
        // 7. 创建二级分类 - 艺术子分类
        Tag music = createTag("音乐", 2, "音乐艺术");
        Tag painting = createTag("绘画", 2, "绘画艺术");
        Tag photography = createTag("摄影", 2, "摄影艺术");
        
        // 8. 创建三级分类 - 科幻子分类
        Tag spaceopera = createTag("太空歌剧", 3, "太空探险主题");
        Tag cyberpunk = createTag("赛博朋克", 3, "赛博朋克风格");
        Tag hardSciFi = createTag("硬科幻", 3, "严谨科学设定");
        
        // 9. 创建三级分类 - 编程子分类
        Tag java = createTag("Java", 3, "Java编程");
        Tag python = createTag("Python", 3, "Python编程");
        Tag webDev = createTag("Web开发", 3, "Web开发技术");
        
        // 10. 建立标签关系
        // 根节点 -> 一级分类
        createTagRelationship("图书", "小说");
        createTagRelationship("图书", "非小说");
        createTagRelationship("图书", "科技");
        createTagRelationship("图书", "人文");
        createTagRelationship("图书", "艺术");
        
        // 小说 -> 二级分类
        createTagRelationship("小说", "科幻");
        createTagRelationship("小说", "奇幻");
        createTagRelationship("小说", "悬疑");
        createTagRelationship("小说", "言情");
        createTagRelationship("小说", "历史");
        createTagRelationship("小说", "惊悚");
        
        // 非小说 -> 二级分类
        createTagRelationship("非小说", "传记");
        createTagRelationship("非小说", "散文");
        createTagRelationship("非小说", "纪实");
        
        // 科技 -> 二级分类
        createTagRelationship("科技", "编程");
        createTagRelationship("科技", "人工智能");
        createTagRelationship("科技", "物理");
        createTagRelationship("科技", "数学");
        createTagRelationship("科技", "生物");
        
        // 人文 -> 二级分类
        createTagRelationship("人文", "哲学");
        createTagRelationship("人文", "心理学");
        createTagRelationship("人文", "社会学");
        createTagRelationship("人文", "经济学");
        
        // 艺术 -> 二级分类
        createTagRelationship("艺术", "音乐");
        createTagRelationship("艺术", "绘画");
        createTagRelationship("艺术", "摄影");
        
        // 科幻 -> 三级分类
        createTagRelationship("科幻", "太空歌剧");
        createTagRelationship("科幻", "赛博朋克");
        createTagRelationship("科幻", "硬科幻");
        
        // 编程 -> 三级分类
        createTagRelationship("编程", "Java");
        createTagRelationship("编程", "Python");
        createTagRelationship("编程", "Web开发");
        
        System.out.println("标签图初始化完成！");
    }
    
    @Override
    public Optional<Tag> getTagByName(String name) {
        return tagRepository.findByName(name);
    }
    
    @Override
    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }
    
    @Override
    public List<Tag> getTagTree() {
        return tagRepository.findAllWithChildren();
    }
    
    @Override
    public List<Tag> getRelatedTags(String tagName) {
        return tagRepository.findRelatedTagsWithinTwoHops(tagName);
    }
    
    @Override
    public List<Book> searchBooksByTag(String tagName) {
        // 1. 获取该标签及其两跳内的所有相关标签
        List<Tag> relatedTags = getRelatedTags(tagName);
        
        if (relatedTags.isEmpty()) {
            return new ArrayList<>();
        }
        
        // 2. 提取所有相关标签的名称
        Set<String> tagNames = relatedTags.stream()
                .map(Tag::getName)
                .collect(Collectors.toSet());
        
        System.out.println("搜索标签: " + tagName);
        System.out.println("相关标签: " + tagNames);
        
        // 3. 在MySQL中查找包含这些标签的所有书籍
        List<Book> allBooks = bookRepository.findAll();
        
        return allBooks.stream()
                .filter(book -> {
                    if (book.getTags() == null || book.getTags().isEmpty()) {
                        return false;
                    }
                    // 将书籍的tags字符串分割成标签列表
                    String[] bookTags = book.getTags().split(",");
                    // 检查书籍是否包含任何相关标签
                    for (String bookTag : bookTags) {
                        if (tagNames.contains(bookTag.trim())) {
                            return true;
                        }
                    }
                    return false;
                })
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional("neo4jTransactionManager")
    public Tag createTag(String name, Integer level, String description) {
        if (tagRepository.existsByName(name)) {
            return tagRepository.findByName(name).get();
        }
        Tag tag = new Tag(name, level, description);
        return tagRepository.save(tag);
    }
    
    @Override
    @Transactional("neo4jTransactionManager")
    public void createTagRelationship(String parentTagName, String childTagName) {
        Optional<Tag> parentOpt = tagRepository.findByName(parentTagName);
        Optional<Tag> childOpt = tagRepository.findByName(childTagName);
        
        if (parentOpt.isPresent() && childOpt.isPresent()) {
            Tag parent = parentOpt.get();
            Tag child = childOpt.get();
            parent.addChild(child);
            tagRepository.save(parent);
        }
    }
    
    @Override
    public List<Tag> getDirectChildren(String tagName) {
        return tagRepository.findDirectChildren(tagName);
    }
    
    @Override
    public List<Tag> getDirectParents(String tagName) {
        return tagRepository.findDirectParents(tagName);
    }
}
