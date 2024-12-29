FROM node:18-alpine as builder

WORKDIR /app

# Install TypeScript and ts-node globally
RUN npm install -g typescript ts-node

COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Copy source code
COPY . .

# Create dist directory
RUN mkdir -p dist

# Build TypeScript code
RUN npx tsc

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Copy environment file
COPY .env.example ./.env

# Add curl for healthcheck
RUN apk --no-cache add curl

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/tasks || exit 1

EXPOSE 3000

CMD ["npm", "start"] 