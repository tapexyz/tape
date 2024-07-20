FROM node:20-alpine AS base

RUN npm install -g pnpm
RUN npm install -g turbo

FROM base AS builder
RUN apk add --no-cache gcompat
WORKDIR /app

# Copy the entire monorepo context
COPY . .

# Install dependencies using pnpm with the help of turbo
RUN turbo install --prefer-offline
RUN turbo run build --filter=@tape.xyz/api

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json

USER hono
EXPOSE 3000

CMD ["node", "/app/dist/index.js"]
