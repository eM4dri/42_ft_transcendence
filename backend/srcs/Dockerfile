# from https://www.youtube.com/watch?v=JsgdvPMMdGA
# from https://notiz.dev/blog/prisma-migrate-deploy-with-docker
# from https://notiz.dev/blog/dockerizing-nestjs-with-prisma-and-postgresql
# TODO use multistages FROM build && FROM Prod 

FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
COPY prisma ./prisma/

RUN yarn install

COPY . .

RUN yarn prisma generate

RUN yarn build

EXPOSE 3000
CMD ["yarn", "start:migrate:dev"]

