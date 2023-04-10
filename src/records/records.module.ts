import { Module } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operation } from 'src/operations/entities/operation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Operation])],
  exports: [TypeOrmModule],
  controllers: [RecordsController],
  providers: [RecordsService],
})
export class RecordsModule {}
