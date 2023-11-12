#!/bin/bash

# Ruta al archivo .env
ENV=".env"

# Verifica si el archivo .env existe
if [ -f "$ENV" ]; then
  echo "Generando environment.ts a partir de $ENV"

  . $ENV

  mkdir -p frontend/srcs/src/environments

  # Ruta al archivo environment.ts
  ENV_TS_FILE="frontend/srcs/src/environments/environment.ts"
  touch $ENV_TS_FILE

  # Crea el contenido de environment.ts
  echo "export const environment = {" > "$ENV_TS_FILE"
  echo "  production: false," >> "$ENV_TS_FILE"
  echo "  host: '$HOST'," >> "$ENV_TS_FILE"
  echo "  apiUrl: '$HOST:$API_PORT'," >> "$ENV_TS_FILE"
  echo "  webUrl: '$HOST:$WEB_PORT'," >> "$ENV_TS_FILE"
  echo "  loginUrl: '$HOST:$API_PORT$FORTYTWO_CLIENT_URL'," >> "$ENV_TS_FILE"
  echo "  staticImagesUrl: '$STATIC_IMAGES_URL'," >> "$ENV_TS_FILE"
  echo "};" >> "$ENV_TS_FILE"

  echo "environment.ts generado exitosamente."
else
  echo "El archivo .env no existe en la raíz del proyecto."
fi

