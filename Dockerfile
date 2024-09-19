# Menggunakan Node versi LTS sebagai base image
FROM node:18

# Set working directory di dalam container
WORKDIR /usr/src/app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy seluruh kode aplikasi
COPY . .

# Expose port aplikasi (port Express.js)
EXPOSE 3000

# Set environment variables untuk koneksi MinIO (luar Docker)
ENV MINIO_ENDPOINT=minio-server
ENV MINIO_PORT=9000
ENV MINIO_ACCESS_KEY=minio-user
ENV MINIO_SECRET_KEY=minio-pass123
ENV MINIO_USE_SSL=false

# Jalankan aplikasi
CMD ["node", "app.js"]
