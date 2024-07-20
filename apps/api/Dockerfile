FROM node:18-alpine AS base

FROM base AS builder
RUN npm install -g pnpm

RUN apk add --no-cache gcompat
WORKDIR /app
COPY package*json tsconfig.json src ./

RUN pnpm install
RUN pnpm run build

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json

USER hono
EXPOSE 3000

RUN npm install -g pnpm
CMD pnpm run start
