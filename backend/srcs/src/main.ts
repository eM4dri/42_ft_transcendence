import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';
import * as session from 'express-session';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  // ? I haven't find a way to resolve this pretty suitable env vars, so HARDCODED
  app.use(
    session({
      cookie: {
        maxAge: 86400000, // all day long
      },
      secret: 'The cake is a lie!',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // app.setGlobalPrefix('v1');
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Products')
    .setDescription('This is my description')
    .setVersion('1.0')
    .build();
    
  app.use(cookieParser());

  const document = SwaggerModule.createDocument(
    app,
    options,
  );

  SwaggerModule.setup('swagger', app, document, {
    // explorer: true,
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
    },
  });

  await app.listen(process.env.API_PORT);
}
bootstrap();
