#!/bin/bash

# Ruta al archivo .env
ENV_ORIGIN=".env"
ENV_FILE=".env_copy"

grep -o '^[^#]*' $ENV_ORIGIN |sed 's/[[:blank:]]*$//'  > $ENV_FILE

# Verifica si el archivo .env existe
if [ -f "$ENV_FILE" ]; then
  echo "Generando environment.ts a partir de $ENV_FILE"

  # Extrae las variables de entorno del archivo .env
  while IFS= read -r line; do
    export "$line"
  done < "$ENV_FILE"

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
  echo "};" >> "$ENV_TS_FILE"

  echo "environment.ts generado exitosamente."

  rm $ENV_FILE
else
  echo "El archivo .env no existe en la raíz del proyecto."
fi

