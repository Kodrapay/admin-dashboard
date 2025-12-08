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

# Set default API base URL for build time
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Build the app
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built app from builder
COPY --from=builder /app/dist ./dist

# Install express
RUN npm install express

# Create server.js
RUN cat > server.js << 'EOF'
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('dist'));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(5173, () => {
  console.log('Server running on port 5173');
});
EOF

EXPOSE 5173

CMD ["node", "server.js"]
