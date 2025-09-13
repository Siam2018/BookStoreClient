import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomerModule } from './Customer/customer.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  console.log('cookie-parser middleware enabled');
  app.enableCors({
    origin: 'http://localhost:4000', // Updated to match frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  console.log('CORS enabled for http://localhost:4000');
  await app.listen(process.env.PORT ?? 3000);
  console.log('NestJS backend listening on port', process.env.PORT ?? 3000);
}
bootstrap();
