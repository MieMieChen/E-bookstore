package bookstore_backend.backend.service;

import bookstore_backend.backend.entity.Book;
import bookstore_backend.backend.entity.Tag;

import java.util.List;
import java.util.Optional;

public interface TagService {
    void initializeTagGraph();
    Optional<Tag> getTagByName(String name);

    List<Tag> getAllTags();

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
    

    Tag createTag(String name, Integer level, String description);

    void createTagRelationship(String parentTagName, String childTagName);

    List<Tag> getDirectChildren(String tagName);

    List<Tag> getDirectParents(String tagName);
}
