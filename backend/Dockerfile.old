# Lighter multistages container from:
#   - https://www.youtube.com/watch?v=JsgdvPMMdGA 
# Run prisma migrations on dockerfile from
#   - https://notiz.dev/blog/prisma-migrate-deploy-with-docker
#   - https://notiz.dev/blog/dockerizing-nestjs-with-prisma-and-postgresql
# TODO use multistages FROM build && FROM Prod

FROM node:18-alpine as BUILDER

WORKDIR /app

COPY srcs/package.json srcs/yarn.lock ./
COPY srcs/prisma ./prisma/

RUN yarn install --frozen-lockfile --ignore-scripts

COPY srcs/. .

RUN yarn prisma generate

RUN yarn build
RUN yarn install --production

# -----------------------------------------------
FROM node:18-alpine as PRODUCTION

ENV NODE_ENV prod

WORKDIR /app

COPY --from=BUILDER app/package.json app/yarn.lock ./
COPY --from=BUILDER app/prisma ./prisma
COPY --from=BUILDER app/dist ./dist
COPY --from=BUILDER app/node_modules ./node_modules

EXPOSE 3000

CMD ["yarn", "start:migrate:prod"]
