# Build stage
FROM node:20-bookworm AS builder

WORKDIR /app

# Install dependencies (including devDependencies for TypeScript build)
COPY package.json package-lock.json* ./
RUN npm install

# Copy source and build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Production dependencies only
RUN rm -rf node_modules && npm install --omit=dev

# Production stage
FROM node:20-bookworm-slim

WORKDIR /app

# Copy built app and production node_modules from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

# Default port (override with -e PORT=...)
ENV PORT=3000
# DB in /app/data so you can mount your project's data folder for persistence
ENV DB_PATH=/app/data/database.sqlite
EXPOSE 3000

RUN mkdir -p /app/data
CMD ["node", "dist/index.js"]
