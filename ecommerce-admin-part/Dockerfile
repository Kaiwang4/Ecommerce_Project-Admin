# 使用Node.js作为基础镜像
FROM node:20.7.0

# 设置工作目录
WORKDIR /app

# 将项目文件复制到工作目录
COPY . .

# 安装项目依赖
RUN npm install -force

# 暴露应用程序运行的端口
EXPOSE 3001

# 启动应用程序
CMD ["npm", "run", "dev"]


