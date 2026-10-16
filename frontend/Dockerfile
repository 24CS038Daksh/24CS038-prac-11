# ==============================================================================
# Frontend Dockerfile: React Application (Multi-Stage Build)
# Student: Daksh Karangiya | Roll: 24CS038
# Goal: Reduce final image size from ~450MB down to ~25MB using Nginx Alpine
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Stage
# ------------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Cache package dependencies
COPY package*.json ./
RUN npm install --silent

# Copy source code and build optimized production bundle
COPY . .
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Production Serving Stage (Lightweight Nginx Alpine)
# ------------------------------------------------------------------------------
FROM nginx:1.25-alpine AS production

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration with reverse proxy for inter-container routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Vite/React port
EXPOSE 5173

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
