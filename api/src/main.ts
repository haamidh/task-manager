import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip properties that are not in the DTO...
      forbidNonWhitelisted: true, // ...and reject the request if any were sent
      transform: true, // turn plain JSON bodies into DTO class instances
    }),
  );

  await app.listen(process.env.PORT ?? 3001);
}
await bootstrap();
