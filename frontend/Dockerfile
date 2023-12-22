# Phase 1: Build the Angular application
FROM node:18-alpine as build

ARG HOST FORTYTWO_CLIENT_URL API_PORT STATIC_IMAGES_URL WEB_PORT

WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY srcs/package*.json ./

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy the rest of the application code to the container
COPY srcs/. .

COPY nginx.conf .

RUN sed -i 's/REPLACE_PORT/'"$WEB_PORT"'/g'  /app/nginx.conf

RUN mkdir -p src/environments

RUN  ENV_TS_FILE="/app/src/environments/environment.ts"                                   \
    &&   echo "export const environment = {" > "$ENV_TS_FILE";                            \
        echo "  production: false," >> "$ENV_TS_FILE";                                    \
        echo "  host: '$HOST'," >> "$ENV_TS_FILE";                                        \
        echo "  apiUrl: '$HOST:$API_PORT'," >> "$ENV_TS_FILE";                            \
        echo "  webUrl: '$HOST:$WEB_PORT'," >> "$ENV_TS_FILE";                            \
        echo "  loginUrl: '$HOST:$API_PORT$FORTYTWO_CLIENT_URL'," >> "$ENV_TS_FILE";      \
        echo "  staticImagesUrl: '$STATIC_IMAGES_URL'," >> "$ENV_TS_FILE";                \
        echo "};" >> "$ENV_TS_FILE";

RUN npm ci --legacy-peer-deps

RUN npm run build --omit=dev

FROM nginx:alpine

COPY --from=build /app/dist/angular-app /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf


