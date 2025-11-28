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
    
    Optional<Tag> findByName(String name);
    
    boolean existsByName(String name);
    List<Tag> findByLevel(Integer level);
    @Query("MATCH (t:Tag {name: $tagName}) " +
           "OPTIONAL MATCH path = (t)-[*0..2]-(related:Tag) " +
           "RETURN DISTINCT related")
    List<Tag> findRelatedTagsWithinTwoHops(@Param("tagName") String tagName);
    @Query("MATCH (parent:Tag {name: $tagName})-[:PARENT_OF*]->(child:Tag) " +
           "RETURN DISTINCT child")
    List<Tag> findAllChildrenRecursive(@Param("tagName") String tagName);

    @Query("MATCH (child:Tag {name: $tagName})<-[:PARENT_OF*]-(parent:Tag) " +
           "RETURN DISTINCT parent")
    List<Tag> findAllParentsRecursive(@Param("tagName") String tagName);

    @Query("MATCH (parent:Tag {name: $tagName})-[:PARENT_OF]->(child:Tag) " +
           "RETURN child")
    List<Tag> findDirectChildren(@Param("tagName") String tagName);
    @Query("MATCH (child:Tag {name: $tagName})<-[:PARENT_OF]-(parent:Tag) " +
           "RETURN parent")
    List<Tag> findDirectParents(@Param("tagName") String tagName);
    @Query("MATCH (t:Tag) " +
           "OPTIONAL MATCH (t)-[:PARENT_OF]->(child:Tag) " +
           "RETURN t, collect(child) as children " +
           "ORDER BY t.level")
    List<Tag> findAllWithChildren();
    @Query("MATCH (t:Tag) DETACH DELETE t")
    void deleteAllTags();
}
