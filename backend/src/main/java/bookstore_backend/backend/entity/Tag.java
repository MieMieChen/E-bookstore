package bookstore_backend.backend.entity;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

/**
 * Tag - Neo4j节点实体
 * 表示图书标签/分类，构成标签树结构
 */
@Node("Tag")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"children", "parents"})  // 避免toString循环引用
public class Tag {
    
    @Id
    @GeneratedValue
    private Long id;
    
    /**
     * 标签名称（唯一）
     */
    private String name;
    
    /**
     * 标签层级（0=根节点"图书"，1=一级分类，2=二级分类，以此类推）
     */
    private Integer level;
    
    /**
     * 标签描述
     */
    private String description;
    
    /**
     * 子标签关系 - 指向此标签的所有子标签
     * PARENT_OF关系：当前标签是子标签的父标签
     */
    @Relationship(type = "PARENT_OF", direction = Relationship.Direction.OUTGOING)
    private Set<Tag> children = new HashSet<>();
    
    /**
     * 父标签关系 - 指向此标签的父标签
     */
    @Relationship(type = "PARENT_OF", direction = Relationship.Direction.INCOMING)
    private Set<Tag> parents = new HashSet<>();
    
    /**
     * 构造函数（不含关系）
     */
    public Tag(String name, Integer level, String description) {
        this.name = name;
        this.level = level;
        this.description = description;
    }
    
    /**
     * 添加子标签
     */
    public void addChild(Tag child) {
        if (this.children == null) {
            this.children = new HashSet<>();
        }
        this.children.add(child);
    }
    
    /**
     * 重写equals方法，只基于id和name，避免循环引用
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Tag tag = (Tag) o;
        // 优先使用id比较（如果都有id）
        if (id != null && tag.id != null) {
            return id.equals(tag.id);
        }
        // 否则使用name比较
        return name != null && name.equals(tag.name);
    }
    
    /**
     * 重写hashCode方法，只基于name，避免循环引用
     */
    @Override
    public int hashCode() {
        // 只使用name计算hashCode，保证稳定性
        return name != null ? name.hashCode() : 0;
    }
}
