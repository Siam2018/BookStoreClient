import { Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CustomerModule } from './Customer/customer.module';
import { ProductModule } from './Products/product.module';
import { OrderModule } from './Order/order.module';
import { AdminModule } from './Admin/admin.module';
import { OrderItemModule } from './OrderItem/orderItem.module';
import { AuthModule } from './Auth/auth.module';
import { MailModule } from './Mail/mail.module';
import { RolesGuard } from './Auth/roles.guard';
import { JwtAuthGuard } from './Auth/jwtAuth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true
    }),
    CustomerModule,
    ProductModule, 
    OrderModule,
    AdminModule,
  OrderItemModule,
  AuthModule,
  MailModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    Reflector
  ],
})
export class AppModule {}
