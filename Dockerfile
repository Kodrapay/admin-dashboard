# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY bun.lockb ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install a simple HTTP server to serve static files
RUN npm install -g serve

# Copy built app from builder
COPY --from=builder /app/dist ./dist

EXPOSE 5173

# Set environment variable for API
ENV VITE_API_BASE_URL=http://api-gateway:7000

CMD ["serve", "-s", "dist", "-l", "5173"]
