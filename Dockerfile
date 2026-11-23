FROM node:22-alpine AS base

RUN apk add --no-cache curl

# Install pnpm on pinned version (see package.json)
RUN npm install -g pnpm@12.21.0

# 1. Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

ARG NEXT_PUBLIC_ENVIRONMENT
ARG NEXT_PUBLIC_GTM_ID
ARG NEXT_PUBLIC_COOKIEBOT_ID
ARG NEXT_PUBLIC_DEMO_URL
ARG NEXT_PUBLIC_DEMO_URL_PRO
ARG NEXT_PUBLIC_DEMO_URL_V2
ARG NEXT_PUBLIC_DEMO_URL_PRO_V2
ARG NEXT_PUBLIC_DEMO_VIEWER
ARG NEXT_TELEMETRY_DISABLED

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN --mount=type=secret,id=github_token,env=GITHUB_TOKEN \
  pnpm run build

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Read from disk at runtime, not traced into the standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.changelogs/index.json ./.changelogs/index.json

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
