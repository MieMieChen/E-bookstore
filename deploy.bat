@echo off
chcp 65001 >nul
echo ================================
echo   Bookstore Docker 部署脚本
echo ================================
echo.

echo [步骤 1/4] 检查 Docker 环境...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未检测到 Docker，请先安装 Docker Desktop
    pause
    exit /b 1
)
echo ✓ Docker 已安装

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未检测到 docker-compose
    pause
    exit /b 1
)
echo ✓ docker-compose 已安装
echo.

echo [步骤 2/4] 打包 Spring Boot 项目...
cd backend
echo 正在编译项目，请稍候...
call mvnw clean package -DskipTests
if errorlevel 1 (
    echo ❌ 错误: Maven 打包失败
    cd ..
    pause
    exit /b 1
)
echo ✓ 项目打包成功
cd ..
echo.

echo [步骤 3/4] 构建并启动 Docker 容器...
docker-compose up -d --build
if errorlevel 1 (
    echo ❌ 错误: Docker 容器启动失败
    pause
    exit /b 1
)
echo ✓ 容器启动成功
echo.

echo [步骤 4/4] 等待服务就绪...
timeout /t 10 /nobreak >nul
echo.

echo ================================
echo   部署完成！
echo ================================
echo.
echo 📊 查看容器状态:
docker-compose ps
echo.
echo 🌐 访问地址:
echo    - 后端 API: http://localhost:8080
echo    - MySQL:    localhost:3306
echo.
echo 📝 常用命令:
echo    - 查看后端日志: docker-compose logs -f backend
echo    - 查看MySQL日志: docker-compose logs -f mysql
echo    - 停止服务:     docker-compose down
echo    - 重启服务:     docker-compose restart
echo.
pause



