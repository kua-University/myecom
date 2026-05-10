FROM node:18-alpine
WORKDIR /app

# Copy package files and install
COPY package*.json ./
RUN npm install

# Copy everything else
COPY . .

# Expose port
EXPOSE 5000

# Start the app
CMD ["node", "server.js"]
