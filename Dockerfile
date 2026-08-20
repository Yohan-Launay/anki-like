FROM node:24-bookworm-slim AS base
WORKDIR /app

# better-sqlite3 n'a pas de binaire précompilé sur musl (Alpine)
# et a besoin de Python + un compilateur C++ pour le fallback node-gyp.
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

# ----------------------------
# Dépendances (dev + prod) pour le build
# ----------------------------
FROM base AS deps
COPY package*.json ./
RUN npm ci

# ----------------------------
# Compilation TypeScript + assets Vite
# ----------------------------
FROM deps AS build
COPY . .
RUN node ace build

# ----------------------------
# Runtime production
# ----------------------------
FROM base AS production
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3333

COPY --from=build /app/build ./
COPY docker-entrypoint.js ./
RUN npm ci --omit=dev \
    && mkdir -p /app/tmp

EXPOSE 3333
CMD ["node", "docker-entrypoint.js"]
