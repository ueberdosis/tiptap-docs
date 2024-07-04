FROM node:20-alpine AS base

ARG BASE_PATH

ARG NEXT_PUBLIC_ENVIRONMENT
ARG NEXT_PUBLIC_DOMAIN
ARG NEXT_PUBLIC_BASE_PATH
ARG NEXT_PUBLIC_REPO
ARG NEXT_PUBLIC_REPO_BASE
ARG NEXT_PUBLIC_DEMO_URL
ARG NEXT_PUBLIC_DEMO_URL_PRO

ARG NEXT_PUBLIC_DOCSEARCH_HOST
ARG NEXT_PUBLIC_DOCSEARCH_PORT
ARG NEXT_PUBLIC_DOCSEARCH_PROTOCOL
ARG NEXT_PUBLIC_DOCSEARCH_INDEX
ARG NEXT_PUBLIC_DOCSEARCH_API_KEY

ARG NEXT_PUBLIC_GTM_ID
ARG NEXT_PUBLIC_COOKIEBOT_ID

ARG NEXT_TELEMETRY_DISABLED

RUN apk add --no-cache curl

# 1. Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi


# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# 2.5 ;) Dev runner
FROM base AS dev_runner
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

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


USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME 0.0.0.0

CMD ["node", "server.js"]
