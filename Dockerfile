# Menggunakan node versi LTS sebagai base image
FROM node:18

# Set working directory di dalam container
WORKDIR /usr/src/app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy seluruh kode aplikasi
COPY . .

# Expose port yang digunakan aplikasi (port Express.js)
EXPOSE 3000

# Jalankan aplikasi
CMD ["node", "app.js"]
