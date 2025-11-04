# Use official Node.js image
FROM node:18-alpine

# Install Python and build tools for bcrypt
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the backend code
COPY . .

# Ensure data directory exists
RUN mkdir -p /app/data

# Expose backend port
EXPOSE 3000

# Start the server
CMD ["node", "index.js"]