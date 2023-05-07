import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ValidationPipe,
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
    @UserId() userId: number,
    @Body() createOperationDto: CreateOperationDto,
  ) {
    return this.operationsService.create(userId, createOperationDto);
  }

  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true }))
    operationQueryOptionsDto: OperationQueryOptionsDto,
  ) {
    return this.operationsService.findAll(operationQueryOptionsDto);
  }

  @Get('balance')
  currentBalance(@UserId() userId: number) {
    return this.operationsService.getUserBalance(userId);
  }
}
