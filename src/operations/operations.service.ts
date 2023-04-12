import { Injectable } from '@nestjs/common';
import { CreateOperationDto } from './dto/create-operation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Operation, OperationTypeEnum } from './entities/operation.entity';
import { User } from 'src/users/entities/user.entity';
import { Record } from 'src/records/entities/record.entity';
import { InsufficientBalanceException } from 'src/errors/exceptions/insufficient-balance.exception';

@Injectable()
export class OperationsService {
  constructor(
    @InjectRepository(Operation)
    private operationRepository: Repository<Operation>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Record)
    private recordRepository: Repository<Record>,

    private configService: ConfigService,

    private httpService: HttpService,
  ) {}

  // Default User Balance
  private readonly userBalance = 100;

  async create(userId: number, createOperationDto: CreateOperationDto) {
    const user = await this.userRepository.findOneBy({ id: userId });
    const operation = await this.operationRepository.findOneBy({
      type: createOperationDto.type,
    });

    const lastRecord = await this.recordRepository.findOne({
      where: {
        user,
      },
      order: {
        date: 'DESC',
      },
    });

    const record = new Record();
    record.operation = operation;
    record.user = user;
    record.amount = operation.cost;
    record.date = new Date();

    record.user_balance = this.calculateUserBalance(
      operation.cost,
      lastRecord.user_balance,
    );

    if (createOperationDto.type === OperationTypeEnum.RANDOM_STRING) {
      const { data: randomData } = await this.getRandomString();

      record.operation_response = randomData;
    } else {
      record.operation_response = String(
        this.calculateOperationResponse(createOperationDto),
      );
    }

    await this.recordRepository.save(record);

    return record.operation_response;
  }

  findAll() {
    return this.operationRepository.find();
  }

  private calculateUserBalance(cost: number, lastUserBalance?: number) {
    if (!lastUserBalance) {
      return this.userBalance - cost;
    }

    if (lastUserBalance - cost < 0) {
      throw new InsufficientBalanceException();
    }

    return lastUserBalance - cost;
  }

  private calculateOperationResponse({
    type,
    value1,
    value2,
  }: CreateOperationDto) {
    switch (type) {
      case OperationTypeEnum.ADDITION:
        return value1 + value2;
      case OperationTypeEnum.SUBTRACTION:
        return value1 - value2;
      case OperationTypeEnum.MULTIPLICATION:
        return value1 - value2;
      case OperationTypeEnum.DIVISION:
        return value1 / value2;
      case OperationTypeEnum.SQUARE_ROOT:
        return Math.sqrt(value1);
    }
  }

  private getRandomString() {
    return this.httpService.axiosRef.get(`request url`);
  }
}
