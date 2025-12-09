# --- Stage 1: Build (สร้างไฟล์ .jar) ---
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy ไฟล์โปรเจกต์ทั้งหมดเข้าไป
COPY . .

# สั่ง Build (จะได้ไฟล์ .jar ในโฟลเดอร์ target/)
RUN mvn clean package -DskipTests

# --- Stage 2: Run (เอาไฟล์ .jar มารัน) ---
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy ไฟล์ .jar มาจาก Stage 1
COPY --from=build /app/target/*.jar app.jar

# เปิด Port 8080 (เพื่อให้ตรงกับ Nginx ที่จะวิ่งเข้ามาหา)
EXPOSE 8080

# สั่งรันโปรแกรม
ENTRYPOINT ["java", "-jar", "app.jar"]