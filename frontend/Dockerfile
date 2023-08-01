FROM node:16.20.0-alpine

RUN apk update && apk add bash
RUN apk add nginx
RUN npm install -g @angular/cli
 
CMD ["nginx", "-g", "daemon off;"]
