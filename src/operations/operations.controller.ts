import { Controller, Get, Post, Body } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { CreateOperationDto } from './dto/create-operation.dto';

@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Post()
  async create(@Body() createOperationDto: CreateOperationDto) {
    return this.operationsService.create(1, createOperationDto);
  }

  @Get()
  findAll() {
    return this.operationsService.findAll();
  }

  @Get()
  staringBalance() {
    return this.operationsService.getStartingBalance();
  }
}
