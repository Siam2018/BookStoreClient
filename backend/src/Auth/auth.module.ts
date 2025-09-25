import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministratorEntity } from '../Administrator/administrator.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CustomerModule } from '../Customer/customer.module';
import { AdminModule } from '../Admin/admin.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdministratorModule } from '../Administrator/administrator.module';
import { AdministratorService } from '../Administrator/administrator.service';

@Module({
  imports: [
    ConfigModule,
    CustomerModule,
    AdminModule,
    AdministratorModule,
    TypeOrmModule.forFeature([AdministratorEntity]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET')?.replace(/"/g, '') || 'defaultSecret',
        signOptions: { expiresIn: '4h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy, AdministratorService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
