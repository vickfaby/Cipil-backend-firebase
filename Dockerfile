# Etapa de build
FROM node:20-bookworm-slim AS builder

# Evitar descargas de navegadores en builder (si se usa puppeteer/playwright en deps)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de runtime
FROM node:20-bookworm-slim AS runner

RUN apt-get update && apt-get install -y \
  chromium \
  libnss3 \
  libfreetype6 \
  libharfbuzz0b \
  ca-certificates \
  fonts-freefont-ttf \
  && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y --no-install-recommends \
  libvips42 \
  && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y --no-install-recommends \
  build-essential python3 libvips-dev \
  && rm -rf /var/lib/apt/lists/*

# Dependencias de sistema para Chromium

# Config Puppeteer para usar Chromium del sistema
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Usuario no privilegiado
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nestjs

WORKDIR /usr/src/app
RUN mkdir -p ./public/uploads \
  && chown -R nestjs:nodejs /usr/src/app/public \
  && chmod -R ug+rwX /usr/src/app/public

# Instalar solo dependencias de producción
COPY package.json package-lock.json ./
RUN npm install --production && npm cache clean --force

# Copiar artefactos construidos y plantillas desde el builder
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/src/common/templates ./src/common/templates

USER nestjs
EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "dist/main.js"]