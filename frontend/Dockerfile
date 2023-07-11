FROM node:16.20.0-alpine

RUN apk update && apk add bash
RUN apk add nginx
 
CMD ["nginx", "-g", "daemon off;"]
