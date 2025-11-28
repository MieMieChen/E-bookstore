package bookstore_backend.backend.repository;

import bookstore_backend.backend.entity.Tag;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * TagRepository - Neo4j标签数据访问接口
 */
@Repository
public interface TagRepository extends Neo4jRepository<Tag, Long> {
    
    /**
     * 根据标签名称查找标签
     */
    Optional<Tag> findByName(String name);
    
    /**
     * 查找所有根节点（level=0）
     */
    List<Tag> findByLevel(Integer level);
    
    /**
     * 查找标签及其两跳内的所有相关标签
     * 包括：
     * 1. 标签本身
     * 2. 父标签
     * 3. 子标签
     * 4. 兄弟标签（共同父标签的子标签）
     * 5. 父标签的父标签
     * 6. 子标签的子标签
     */
    @Query("MATCH (t:Tag {name: $tagName}) " +
           "OPTIONAL MATCH path = (t)-[*0..2]-(related:Tag) " +
           "RETURN DISTINCT related")
    List<Tag> findRelatedTagsWithinTwoHops(@Param("tagName") String tagName);
    
    /**
     * 获取标签的所有子标签（递归）
     */
    @Query("MATCH (parent:Tag {name: $tagName})-[:PARENT_OF*]->(child:Tag) " +
           "RETURN DISTINCT child")
    List<Tag> findAllChildrenRecursive(@Param("tagName") String tagName);
    
    /**
     * 获取标签的所有父标签（递归）
     */
    @Query("MATCH (child:Tag {name: $tagName})<-[:PARENT_OF*]-(parent:Tag) " +
           "RETURN DISTINCT parent")
    List<Tag> findAllParentsRecursive(@Param("tagName") String tagName);
    
    /**
     * 获取标签的直接子标签
     */
    @Query("MATCH (parent:Tag {name: $tagName})-[:PARENT_OF]->(child:Tag) " +
           "RETURN child")
    List<Tag> findDirectChildren(@Param("tagName") String tagName);
    
    /**
     * 获取标签的直接父标签
     */
    @Query("MATCH (child:Tag {name: $tagName})<-[:PARENT_OF]-(parent:Tag) " +
           "RETURN parent")
    List<Tag> findDirectParents(@Param("tagName") String tagName);
    
    /**
     * 检查标签是否存在
     */
    boolean existsByName(String name);
    
    /**
     * 获取所有标签（用于构建标签树）
     */
    @Query("MATCH (t:Tag) " +
           "OPTIONAL MATCH (t)-[:PARENT_OF]->(child:Tag) " +
           "RETURN t, collect(child) " +
           "ORDER BY t.level, t.name")
    List<Tag> findAllWithChildren();
}
