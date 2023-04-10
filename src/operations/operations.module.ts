import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';
import { SharedModule } from 'src/shared/shared.module';
import { UsersModule } from 'src/users/users.module';
import { RecordsModule } from 'src/records/records.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [SharedModule, UsersModule, RecordsModule, ConfigModule, HttpModule],
  controllers: [OperationsController],
  providers: [OperationsService],
})
export class OperationsModule {}
