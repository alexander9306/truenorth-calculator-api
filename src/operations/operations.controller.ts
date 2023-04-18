import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ValidationPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { OperationsService } from './operations.service';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UserId } from 'src/shared/decorators/user-id.decorator';
import { OperationQueryOptionsDto } from './dto/operation-query-options.dto';

@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Post()
  async create(
    @UserId() id: number,
    @Body() createOperationDto: CreateOperationDto,
  ) {
    return this.operationsService.create(id, createOperationDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true }))
    operationQueryOptionsDto: OperationQueryOptionsDto,
  ) {
    return this.operationsService.findAll(operationQueryOptionsDto);
  }

  @Get('balance')
  currentBalance(@UserId() id: number) {
    return this.operationsService.getCurrentBalance(id);
  }
}
