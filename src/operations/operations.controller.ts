import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { OperationsService } from './operations.service';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UserId } from 'src/shared/decorators/user-id.decorator';
import { OperationOptionsDto } from './dto/operation-options.dto';

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
  findAll(@Query() operationOptionsDto: OperationOptionsDto) {
    return this.operationsService.findAll(operationOptionsDto);
  }

  @Get()
  staringBalance() {
    return this.operationsService.getStartingBalance();
  }
}
