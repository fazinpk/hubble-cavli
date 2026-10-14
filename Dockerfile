FROM node:24-alpine AS base
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# Full dependencies, including the Prisma CLI. `npm ci` runs postinstall, which generates the Prisma client.
FROM base AS deps
COPY package.json package-lock.json prisma.config.ts ./
COPY prisma ./prisma
RUN npm ci

# Applies database migrations, then exits. Used by docker-compose before the app starts.
FROM deps AS migrate
CMD ["npx", "prisma", "migrate", "deploy"]

FROM deps AS builder
COPY . .
RUN npm run build

# Only the standalone server and static assets, no node_modules install.
FROM base AS runner
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]
