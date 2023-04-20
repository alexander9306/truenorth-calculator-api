import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';
import { UsersModule } from 'src/users/users.module';
import { RecordsModule } from 'src/records/records.module';

import { Operation } from './entities/operation.entity';

@Module({
  imports: [
    UsersModule,
    RecordsModule,
    HttpModule,
    TypeOrmModule.forFeature([Operation]),
  ],
  controllers: [OperationsController],
  providers: [OperationsService],
})
export class OperationsModule {}
