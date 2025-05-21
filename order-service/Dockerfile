# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build TypeScript files
RUN npm run build

# Expose application port
EXPOSE 3001

# Define container startup command
CMD ["node", "dist/index.js"]
