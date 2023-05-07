import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';
import { RecordsModule } from 'src/records/records.module';
import { Operation } from './entities/operation.entity';
import { OperationRepository } from './operation.repository';
import { RandomService } from './random/random.service';

@Module({
  imports: [RecordsModule, HttpModule, TypeOrmModule.forFeature([Operation])],
  controllers: [OperationsController],
  providers: [OperationsService, OperationRepository, RandomService],
})
export class OperationsModule {}
