import { Controller, Get, Param, Delete, Query } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordQueryOptionsDto } from './dto/record-query-options.dto';

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Get()
  findAll(@Query() recordQueryOptionsDto: RecordQueryOptionsDto) {
    return this.recordsService.findAll(recordQueryOptionsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recordsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recordsService.remove(+id);
  }
}
