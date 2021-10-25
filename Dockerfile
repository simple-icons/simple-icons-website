FROM node:16-alpine

# Install system dependencies and development tools
RUN apk add --no-cache \
  git \
  xdg-utils

# Configure image
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
WORKDIR /website

# Install dependencies
COPY package*.json /website/
RUN npm install

# Copy source and build website
COPY . .
RUN npm run build

# Expose port, run server, and build while looking for changes
EXPOSE 8080
ENTRYPOINT ["npm", "run", "serve:watch"]
