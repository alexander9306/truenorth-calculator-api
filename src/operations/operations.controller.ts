import { Controller, Get, Post, Body, Query } from '@nestjs/common';
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

  @Get()
  findAll(@Query() operationQueryOptionsDto: OperationQueryOptionsDto) {
    return this.operationsService.findAll(operationQueryOptionsDto);
  }

  @Get('default-balance')
  staringBalance() {
    return this.operationsService.getStartingBalance();
  }
}
