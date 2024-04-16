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

# 開啟 80 端口
EXPOSE 80

# 預設啟動 Nginx 伺服器
CMD ["nginx", "-g", "daemon off;"]
