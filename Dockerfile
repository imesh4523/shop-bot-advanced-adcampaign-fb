# --- Build Stage ---
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files and install all dependencies (including devDependencies needed for build)
COPY package*.json ./
RUN npm install

# Copy all source files and configs
COPY . .

# Run the build script (runs esbuild & vite, generating dist/)
RUN npm run build

# --- Production Stage ---
FROM node:20-slim

# Install PostgreSQL 17 client
RUN apt-get update && apt-get install -y curl gnupg2 lsb-release \
    && echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list \
    && curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - \
    && apt-get update && apt-get install -y postgresql-client-17 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm install --production

# Copy built assets from builder stage
COPY --from=builder /app/dist/ ./dist/
COPY --from=builder /app/public/ ./public/

# Set production environment
ENV NODE_ENV=production
ENV PORT=8080

# Expose the API port
EXPOSE 8080

# Start the application directly with node (no npm run start)
CMD ["node", "dist/index.cjs"]


