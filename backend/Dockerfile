# ==============================================================================
# Backend Dockerfile: Node.js / Express Task Management API
# Student: Daksh Karangiya | Roll: 24CS038
# Base Image: Lightweight Node 20 on Alpine Linux
# ==============================================================================

FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000

# Install dependencies first (leverages Docker layer caching)
COPY package*.json ./
RUN npm install --omit=dev --silent

# Copy application source code (node_modules excluded via .dockerignore)
COPY . .

# Expose backend API port (metadata/documentation for inter-container communication)
EXPOSE 5000

# Use unprivileged user for security compliance
USER node

# Healthcheck to verify Express API responsiveness
HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start Node server
CMD ["node", "server.js"]
