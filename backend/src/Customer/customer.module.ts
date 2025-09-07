import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from "./customer.controller";
import { CustomerService } from "./customer.service";
import { CustomerEntity } from './customer.entity';
import { MailModule } from '../Mail/mail.module';

@Module({
    imports: [TypeOrmModule.forFeature([CustomerEntity]), MailModule],
    controllers: [CustomerController],
    providers: [CustomerService],
    exports: [CustomerService]
})

export class CustomerModule {}