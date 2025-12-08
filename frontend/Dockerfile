# frontend/Dockerfile

# 1. Base Image
FROM node:22-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy dependencies files
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy source code
COPY . .

# 6. Build Next.js
RUN npm run build

# 7. Start App
CMD ["npm", "start"]