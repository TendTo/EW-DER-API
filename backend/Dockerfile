
FROM node:16-alpine

# Create app directory
WORKDIR /app

# Install app dependencies - For NPM use: `COPY package.json package-lock.lock ./`
COPY package.json package-lock.json ./
# For NPM use: `RUN npm ci`
RUN npm ci

# Copy important files
COPY tsconfig.json tsconfig.build.json nest-cli.json .env ./

COPY src .

CMD [ "npm", "run", "start:dev", "--preserveWatchOutput" ]