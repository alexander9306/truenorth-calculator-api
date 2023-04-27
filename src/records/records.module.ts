import { Module } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from './entities/record.entity';
import { RecordRepository } from './record.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Record])],
  exports: [TypeOrmModule],
  controllers: [RecordsController],
  providers: [RecordsService, RecordRepository],
})
export class RecordsModule {}
