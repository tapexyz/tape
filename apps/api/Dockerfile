# Base image
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat openssl

# Builder stage
FROM base AS builder
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy all files to the build context
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the project
RUN pnpm --filter @tape.xyz/api build

# Prune dev dependencies to reduce image size
RUN pnpm prune --prod

# Runner stage
FROM base AS runner
WORKDIR /app

# Create non-root user first
RUN addgroup --system --gid 1001 hono && \
    adduser --system --uid 1001 app

# Install pnpm globally in a way that's accessible to non-root user
ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
RUN mkdir -p ${PNPM_HOME} && \
    chown -R app:hono ${PNPM_HOME} && \
    npm install -g pnpm && \
    chown -R app:hono /app

# Install pnpm globally
RUN npm install -g pnpm

# Add non-root user for better security
RUN addgroup --system --gid 1001 hono
RUN adduser --system --uid 1001 app

USER app

# Copy built application and production dependencies from builder stage
COPY --from=builder /app .

# Expose the port
EXPOSE 3000

# Command to run the app
CMD sleep 3 && pnpm --filter @tape.xyz/api start
