package bookstore_backend.backend.service;

import bookstore_backend.backend.entity.Book;
import bookstore_backend.backend.entity.Tag;

import java.util.List;
import java.util.Optional;

/**
 * TagService - 标签服务接口
 */
public interface TagService {
    
    /**
     * 初始化标签图结构
     * 创建根节点"图书"及其子分类树
     */
    void initializeTagGraph();
    
    /**
     * 根据标签名称获取标签
     */
    Optional<Tag> getTagByName(String name);
    
    /**
     * 获取所有标签
     */
    List<Tag> getAllTags();
    
    /**
     * 获取标签树（层级结构）
     */
    List<Tag> getTagTree();
    
    /**
     * 获取指定标签两跳内的所有相关标签
     * @param tagName 标签名称
     * @return 相关标签列表（包括标签本身）
     */
    List<Tag> getRelatedTags(String tagName);
    
    /**
     * 根据标签搜索书籍
     * 会找出该标签及其两跳内相关标签的所有书籍
     * @param tagName 标签名称
     * @return 匹配的书籍列表
     */
    List<Book> searchBooksByTag(String tagName);
    
    /**
     * 创建标签
     */
    Tag createTag(String name, Integer level, String description);
    
    /**
     * 创建标签关系（父子关系）
     */
    void createTagRelationship(String parentTagName, String childTagName);
    
    /**
     * 获取标签的直接子标签
     */
    List<Tag> getDirectChildren(String tagName);
    
    /**
     * 获取标签的直接父标签
     */
    List<Tag> getDirectParents(String tagName);
}
