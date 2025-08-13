# Etapa de build
FROM node:18-slim AS builder

WORKDIR /app

# Instala dependências do sistema para build e Chromium
RUN apt-get update && apt-get install -y \
	openssl \
	iputils-ping \
	&& rm -rf /var/lib/apt/lists/*

COPY ./app ./

RUN npm install
RUN npm run build

# Etapa final
FROM node:18-slim

WORKDIR /app

# Instala dependências do sistema para Chromium
RUN apt-get update && apt-get install -y \
	openssl \
	iputils-ping \
	&& rm -rf /var/lib/apt/lists/*

# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
# ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
# ENV DISPLAY=:99

# Instala o PM2 globalmente
RUN npm install -g pm2

# Copia a aplicação da build
COPY --from=builder /app /app

# Expõe a porta padrão do Next.js
EXPOSE 3000

CMD ["pm2-runtime", "start", "npm", "--", "start"]

