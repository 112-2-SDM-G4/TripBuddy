# 使用官方 Node.js 映像作為基礎映像
FROM node:latest AS builder

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝相依套件
RUN npm install

# 複製整個專案到容器中
COPY . .

# 建置 React 應用程式
RUN npm run build

# 使用 Nginx 伺服器作為靜態資源伺服器
FROM nginx:latest

# 複製 React 應用程式的建置結果到 Nginx 的 HTML 資料夾
COPY --from=builder /app/build /usr/share/nginx/html

# 刪除預設 Nginx 配置文件
RUN rm /etc/nginx/conf.d/default.conf

# 複製自定義 Nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/nginx.conf

# 開啟 8080 端口
EXPOSE 8080

# 預設啟動 Nginx 伺服器
CMD ["nginx", "-g", "daemon off;"]
