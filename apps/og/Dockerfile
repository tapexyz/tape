FROM node:20-alpine AS base
WORKDIR /tape
RUN npm install -g pnpm && \
    apk add --no-cache libc6-compat python3 make g++

FROM base AS deps
COPY ../../pnpm-workspace.yaml ../../pnpm-lock.yaml ../../package.json ./
COPY ../../apps/og ./apps/og
COPY ../../packages ./packages
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /tape
COPY --from=deps /tape/ ./
WORKDIR /tape/apps/og
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
RUN pnpm build && \
    mkdir -p .next/standalone/apps/og/.next/static && \
    cp -r .next/static/* .next/standalone/apps/og/.next/static/

FROM node:20-alpine AS runner
WORKDIR /tape
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 tape-web-group && \
    adduser --system --uid 1001 --ingroup tape-web-group tape-web
COPY --from=builder --chown=tape-web:tape-web-group /tape/apps/og/.next/standalone ./
USER tape-web
EXPOSE 3000
CMD ["node", "apps/og/server.js"]
