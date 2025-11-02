# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY server/package.json ./
RUN npm install

# Copy backend source code
COPY server/ .

# Ensure data directory exists for SQLite database
RUN mkdir -p /app/data

# Expose the backend port
EXPOSE 3000

# Start the server
CMD ["node", "index.js"]