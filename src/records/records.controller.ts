import {
  Controller,
  Get,
  Param,
  Delete,
  Query,
  ValidationPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordQueryOptionsDto } from './dto/record-query-options.dto';

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true }))
    recordQueryOptionsDto: RecordQueryOptionsDto,
  ) {
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
