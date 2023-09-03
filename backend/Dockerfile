# Use a specific Node.js version and Alpine Linux version
FROM node:18-alpine as BUILDER

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY srcs/package.json srcs/yarn.lock ./

# Copy Prisma schema
COPY srcs/prisma ./prisma/

# Install dependencies
RUN yarn install --frozen-lockfile 

# Copy the rest of the application code
COPY srcs/. .

# Generate Prisma client and build the application
RUN yarn prisma generate
RUN yarn build
RUN yarn install --production

# -----------------------------------------------
# Production image
FROM node:18-alpine as PRODUCTION

# Set the environment variable
ENV NODE_ENV=production

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY --from=BUILDER /app/package.json /app/yarn.lock ./

# Copy Prisma schema, application code, and node_modules
COPY --from=BUILDER /app/prisma ./prisma
COPY --from=BUILDER /app/dist ./dist
COPY --from=BUILDER /app/node_modules ./node_modules

# Expose the application port
EXPOSE 3000

# Define the start command
CMD ["yarn", "start:migrate:prod"]

# Optional: Add a HEALTHCHECK
HEALTHCHECK --interval=30s --timeout=10s --retries=3 CMD ["yarn", "healthcheck"]

