# 使用 Eclipse Temurin JDK 17 作为基础镜像（OpenJDK 官方推荐）
FROM eclipse-temurin:17-jdk-alpine

# 设置工作目录
WORKDIR /app

# 复制编译好的 JAR 文件到容器中
COPY target/*.jar app.jar

# 暴露 Spring Boot 应用的端口
EXPOSE 8080

# 启动应用
ENTRYPOINT ["java", "-jar", "app.jar"]

