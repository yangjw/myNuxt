# 构建阶段
FROM node:18-alpine as builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# 生产阶段
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/package*.json /app/

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production

CMD ["node", ".output/server/index.mjs"] 