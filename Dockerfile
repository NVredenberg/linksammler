# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (falls vorhanden)
COPY server/package*.json ./

# Install dependencies
RUN npm install
# Copy rest of the backend code
COPY server/ .

# Ensure data directory exists
RUN mkdir -p /app/data

# Expose backend port
EXPOSE 3000

# Start the server
CMD ["node", "index.js"]