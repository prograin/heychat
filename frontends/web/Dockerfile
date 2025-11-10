# -------------------------------
# 1. Use official Node.js LTS image
# -------------------------------
FROM node:20-alpine AS builder

# Set working directory inside container
WORKDIR /usr/hey-app/frontends/web

# -------------------------------
# 2. Copy package files first for caching
# -------------------------------
COPY frontends/web/package*.json ./

# Install all dependencies (needed for build)
RUN npm ci

# -------------------------------
# 3. Copy the rest of the source code
# -------------------------------
COPY frontends/web ./
COPY shared /usr/hey-app/shared

# -------------------------------
# 4. Build the app
# -------------------------------
RUN npm run build

# -------------------------------
# 5. Serve using vite preview (no nginx)
# -------------------------------
FROM node:20-alpine AS runner

WORKDIR /usr/hey-app/frontends/web

# Copy built output and only what's needed to serve
COPY --from=builder /usr/hey-app/frontends/web ./
COPY shared /usr/hey-app/shared

# Expose Vite preview port
EXPOSE 4173

# Environment variables
ENV VITE_NODE_ENV=production
ENV API_URL=host.docker.internal

# Run the preview server
CMD ["npm", "run", "preview"]
