# Base image
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat openssl

# Installer stage
FROM base AS installer
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy all files to the build context
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Prune dev dependencies to reduce image size
RUN pnpm prune --prod

# Runner stage
FROM base AS runner
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

RUN addgroup --system --gid 1001 nodeCron
RUN adduser --system --uid 1001 app

RUN mkdir -p /app/_tmp && \
    mkdir -p /home/app/.local/share/pnpm && \
    mkdir -p /home/app/.npm && \
    chown -R app:nodeCron /app /home/app/.local /home/app/.npm && \
    chmod 777 /app/_tmp

USER app

# Copy built application and production dependencies from builder stage
COPY --from=installer /app .

# Command to run the app
CMD sleep 3 && pnpm --filter @tape.xyz/cron start
