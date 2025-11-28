package bookstore_backend.backend.controller;

import bookstore_backend.backend.entity.Book;
import bookstore_backend.backend.entity.Tag;
import bookstore_backend.backend.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * TagController - 标签控制器
 * 提供标签管理和基于标签搜索书籍的API
 */
@RestController
@RequestMapping("/api/tags")
@CrossOrigin(origins = "http://localhost:3000")
public class TagController {
    
    @Autowired
    private TagService tagService;
    
    /**
     * 初始化标签图
     * POST /api/tags/initialize
     */
    @PostMapping("/initialize")
    public ResponseEntity<String> initializeTagGraph() {
        try {
            tagService.initializeTagGraph();
            return ResponseEntity.ok("标签图初始化成功");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("标签图初始化失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取所有标签
     * GET /api/tags
     */
    @GetMapping
    public ResponseEntity<List<Tag>> getAllTags() {
        try {
            List<Tag> tags = tagService.getAllTags();
            return ResponseEntity.ok(tags);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * 获取标签树（层级结构）
     * GET /api/tags/tree
     */
    @GetMapping("/tree")
    public ResponseEntity<List<Tag>> getTagTree() {
        try {
            List<Tag> tree = tagService.getTagTree();
            return ResponseEntity.ok(tree);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * 根据名称获取标签
     * GET /api/tags/{name}
     */
    @GetMapping("/{name}")
    public ResponseEntity<Tag> getTagByName(@PathVariable String name) {
        try {
            return tagService.getTagByName(name)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * 获取标签的两跳内相关标签
     * GET /api/tags/{name}/related
     */
    @GetMapping("/{name}/related")
    public ResponseEntity<List<Tag>> getRelatedTags(@PathVariable String name) {
        try {
            List<Tag> relatedTags = tagService.getRelatedTags(name);
            return ResponseEntity.ok(relatedTags);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * 获取标签的直接子标签
     * GET /api/tags/{name}/children
     */
    @GetMapping("/{name}/children")
    public ResponseEntity<List<Tag>> getDirectChildren(@PathVariable String name) {
        try {
            List<Tag> children = tagService.getDirectChildren(name);
            return ResponseEntity.ok(children);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * 根据标签搜索书籍（核心功能）
     * GET /api/tags/{name}/books
     * 
     * 搜索逻辑：
     * 1. 在Neo4j中找到该标签
     * 2. 找出该标签两跳内的所有相关标签
     * 3. 在MySQL中查找包含这些标签的所有书籍
     */
    @GetMapping("/{name}/books")
    public ResponseEntity<List<Book>> searchBooksByTag(@PathVariable String name) {
        try {
            List<Book> books = tagService.searchBooksByTag(name);
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
