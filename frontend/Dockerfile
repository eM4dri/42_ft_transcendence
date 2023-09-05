# Phase 1: Build the Angular application
FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY srcs/package*.json ./

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy the rest of the application code to the container
COPY srcs/. .

RUN chmod +x run.sh

CMD ["/bin/sh", "run.sh"]

