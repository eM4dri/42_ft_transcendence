FROM node:16.20.0-alpine

RUN apk update && apk add bash
RUN apk add nginx
RUN npm install -g @angular/cli
 
WORKDIR /app

CMD npm run start
