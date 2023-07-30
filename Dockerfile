FROM node:16

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

CMD [ "node", "dist/bot.js" ]