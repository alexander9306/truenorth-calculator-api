import {
  Controller,
  Get,
  Post,
  Body,
  ForbiddenException,
} from '@nestjs/common';
import { OperationsService } from './operations.service';
import { CreateOperationDto } from './dto/create-operation.dto';

@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Post()
  async create(@Body() createOperationDto: CreateOperationDto) {
    try {
      const res = await this.operationsService.create(1, createOperationDto);
      if (res === null) {
        throw new ForbiddenException(
          'Insufficient balance to perform this operation',
        );
      }
      return this.operationsService.create(1, createOperationDto);
    } catch (error) {
      throw new ForbiddenException(
        'Insufficient balance to perform this operation',
      );
    }
  }

  @Get()
  findAll() {
    return this.operationsService.findAll();
  }
}
