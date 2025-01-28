# Auto-runs via .github/workflows/public-ghcr.yml

# Use node v18 for arm64 (RaspberryPi)
FROM --platform=linux/arm64 node:20

# Working dir
WORKDIR /usr/src/app

# Copy package json files
COPY package*.json ./

# Install files
RUN npm install

# Copy source files (- .dockerignore)
COPY . .

# Build
RUN npm run build:prod

# Env
ENV NODE_ENV=production

CMD [ "node", "dist/bot.js" ]