import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministratorEntity } from './administrator.entity';
import { AdministratorService } from './administrator.service';
import { AdministratorController } from './administrator.controller';

@Module({
    imports: [TypeOrmModule.forFeature([AdministratorEntity])],
    providers: [AdministratorService],
    controllers: [AdministratorController],
    exports: [AdministratorService],
})
export class AdministratorModule {}
