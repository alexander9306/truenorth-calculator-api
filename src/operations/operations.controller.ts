import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  UsePipes,
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
    @UserId() id: number,
    @Body() createOperationDto: CreateOperationDto,
  ) {
    return this.operationsService.create(id, createOperationDto);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll(@Query() operationOptionsDto: OperationQueryOptionsDto) {
    return this.operationsService.findAll(operationOptionsDto);
  }

  @Get('default-balance')
  staringBalance() {
    return this.operationsService.getStartingBalance();
  }
}
