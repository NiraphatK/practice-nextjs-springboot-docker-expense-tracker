# --- Stage 1: Build JAR ด้วย Maven ---
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# --- Stage 2: Extract Layers (แยกส่วนประกอบ) ---
FROM eclipse-temurin:17-jre-alpine AS layers
WORKDIR /app
# ก๊อปไฟล์ jar จาก Stage 1 มา extract
COPY --from=builder /app/target/*.jar app.jar
# ใช้ layertools แยกส่วนประกอบออกมา
RUN java -Djarmode=layertools -jar app.jar extract

# --- Stage 3: Final Image (สร้าง Image จริง) ---
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# ก๊อปปี้ทีละ Layer (เรียงลำดับตามความถี่ในการเปลี่ยนแปลง)
# 1. Dependencies (เปลี่ยนน้อยสุด)
COPY --from=layers /app/dependencies/ ./
# 2. Spring Boot Loader
COPY --from=layers /app/spring-boot-loader/ ./
# 3. Snapshot Dependencies
COPY --from=layers /app/snapshot-dependencies/ ./
# 4. Application Code (เปลี่ยนบ่อยสุด - Code ที่เราเขียน)
COPY --from=layers /app/application/ ./

# ใช้ JarLauncher ของ Spring Boot ในการรัน
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]