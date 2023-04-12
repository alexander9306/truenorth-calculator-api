import { Controller, Get, Post, Body } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UserId } from 'src/shared/decorators/user-id.decorator';

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
  findAll() {
    return this.operationsService.findAll();
  }

  @Get()
  staringBalance() {
    return this.operationsService.getStartingBalance();
  }
}
