# docker build ./ws-bot2/ -t garrettls88/ws-bot2:latest
# Use node v16 for arm64 (RaspberryPi)
FROM --platform=linux/arm64 node:16

# Working dir
WORKDIR /usr/src/app

# Copy package json files
COPY package*.json ./

# Install files
RUN npm install

# Copy source files
COPY . .

# Build
RUN npm run build:prod

# Env
ENV NODE_ENV=production

CMD [ "node", "dist/bot.js" ]