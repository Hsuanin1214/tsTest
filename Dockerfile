# =========== 建置階段 (Node.js) ===========
FROM node:22-alpine AS build
WORKDIR /app

# 安裝安全更新
RUN apk update && apk upgrade && apk add --no-cache curl

# 複製 package 檔案並安裝依賴
COPY package*.json ./
RUN npm ci

# 複製源碼並建置
COPY . .
# 設定好 vite.config.js 中的 base
RUN npm run build

# =========== 運行階段 (Nginx) ===========
FROM nginx:alpine

# 安裝安全更新和必要工具
RUN apk update && apk upgrade && apk add --no-cache curl

# 修改現有的 nginx 用戶為指定的 UID
RUN deluser nginx && \
    addgroup -g 1001 -S nginx && \
    adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G nginx nginx

# 創建目錄並複製建置結果
RUN mkdir -p /usr/share/nginx/html/eiameeting
COPY --from=build /app/dist /usr/share/nginx/html/eiameeting

# 注意：nginx.conf 將通過 Docker Compose volume mount 外部提供
# 移除默認配置檔案，讓外部 nginx.conf 能正常工作
RUN rm -f /etc/nginx/conf.d/default.conf

# 設置權限
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/eiameeting/ || exit 1

EXPOSE 80
USER nginx
CMD ["nginx", "-g", "daemon off;"]