# --- Stage 1: Build ---
FROM node:22-alpine AS builder
WORKDIR /app

# Copy ไฟล์ dependencies มาลงก่อน
COPY package*.json ./
RUN npm install

# Copy Code ทั้งหมด แล้วสั่ง Build
COPY . .
RUN npm run build

# --- Stage 2: Run (เริ่ม Server) ---
FROM node:22-alpine AS runner
WORKDIR /app

# ตั้งค่า Environment เป็น Production
ENV NODE_ENV production

# Copy ไฟล์ที่ Build เสร็จแล้วมาจาก Stage 1
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# เปิด Port 3000
EXPOSE 3000

# สั่งรันด้วยคำสั่งมาตรฐาน
CMD ["npm", "start"]