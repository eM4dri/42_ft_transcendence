export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_NAME: string;
      DB_PORT: number;
      DB_URL: string;
      FORTYTWO_CLIENT_ID: string;
      FORTYTWO_CLIENT_SECRET: string;
      FORTYTWO_CLIENT_URL: string;
      FORTYTWO_CLIENT_URL_CALLBACK: string;
      JWT_SECRET: string;
      JWT_EXPIRES_IN: number;
      PORTAINER_VOLUME_PATH: string;
      POSTGRES_VOLUME_PATH: string;
      PGADMIN_VOLUME_PATH: string;
      ENV: 'test' | 'dev' | 'prod';
    }
  }
}
