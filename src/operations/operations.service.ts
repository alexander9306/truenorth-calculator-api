import { Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { CreateOperationDto } from './dto/create-operation.dto';
import { OperationTypeEnum } from './entities/operation.entity';
import { User } from 'src/users/entities/user.entity';
import { Record } from 'src/records/entities/record.entity';
import { InsufficientBalanceException } from 'src/errors/exceptions/insufficient-balance.exception';
import { OperationQueryOptionsDto } from './dto/operation-query-options.dto';
import { RandomAPIResponse } from './interfaces/random-api-response.interface';
import { RandomAPIOptions } from './interfaces/random-api-options.interface';
import { OperationRepository } from './operation.repository';
import { RecordRepository } from 'src/records/record.repository';
import { StatusEnum } from 'src/shared/enums/status.enum';

@Injectable()
export class OperationsService {
  // Default User Balance
  private readonly defaultUserBalance =
    parseInt(process.env.DEFAULT_BALANCE, 10) || 150;

  private readonly bigNumber = BigNumber;

  constructor(
    @InjectRepository(OperationRepository)
    private operationRepository: OperationRepository,

    @InjectRepository(RecordRepository)
    private recordRepository: RecordRepository,

    private httpService: HttpService,
  ) {
    // Set a maximum of 10 decimal places
    this.bigNumber.set({ DECIMAL_PLACES: 10 });
  }

  async create(userId: number, createOperationDto: CreateOperationDto) {
    const user = new User();
    user.id = userId;

    const operation = await this.operationRepository.findOneBy({
      type: createOperationDto.type,
    });

    const record = new Record();
    record.operation = operation;
    record.user = user;
    record.amount = operation.cost;
    record.date = new Date();

    const userRecords = await this.recordRepository.find({
      where: {
        user: {
          id: user.id,
        },
        status: StatusEnum.ACTIVE,
      },
      order: {
        date: 'DESC',
      },
    });

    const amountTotal = userRecords.reduce<number>(
      (previous, current) => previous + current.amount,
      0,
    );

    record.user_balance = this.calculateBalance(operation.cost, amountTotal);

    record.operation_response =
      createOperationDto.type === OperationTypeEnum.RANDOM_STRING
        ? await this.getRandomString()
        : this.calculateResult(createOperationDto);

    await this.recordRepository.save(record);

    return { result: record.operation_response };
  }

  async getCurrentBalance(userId: number) {
    const userRecords = await this.recordRepository.find({
      where: {
        user: {
          id: userId,
        },
        status: StatusEnum.ACTIVE,
      },
      order: {
        date: 'DESC',
      },
    });

    const amountTotal = userRecords.reduce<number>(
      (previous, current) => previous + current.amount,
      0,
    );

    return {
      startedBalance: this.defaultUserBalance,
      currentBalance: amountTotal
        ? this.defaultUserBalance - amountTotal
        : this.defaultUserBalance,
    };
  }

  findAll(query: OperationQueryOptionsDto) {
    return this.operationRepository.findAndCountAll(query);
  }

  private calculateBalance(cost: number, previousCostTotal: number) {
    if (previousCostTotal === 0) {
      return this.defaultUserBalance - cost;
    }

    const balance = this.defaultUserBalance - (previousCostTotal + cost);
    if (balance < 0) {
      throw new InsufficientBalanceException();
    }

    return balance;
  }

  private evaluateOperation({ type, num1, num2 }: CreateOperationDto) {
    switch (type) {
      case OperationTypeEnum.ADDITION:
        return this.bigNumber(num1).plus(num2);
      case OperationTypeEnum.SUBTRACTION:
        return this.bigNumber(num1).minus(num2);
      case OperationTypeEnum.MULTIPLICATION:
        return this.bigNumber(num1).multipliedBy(num2);
      case OperationTypeEnum.DIVISION:
        return this.bigNumber(num1).dividedBy(num2);
      case OperationTypeEnum.SQUARE_ROOT:
        return this.bigNumber(num1).squareRoot();
    }
  }

  private calculateResult(values: CreateOperationDto): string {
    const result = this.evaluateOperation(values);
    if (!result.isFinite()) return '∞';

    return result.toString();
  }

  private async getRandomString() {
    const options: RandomAPIOptions = {
      jsonrpc: '2.0',
      method: 'generateStrings',
      params: {
        apiKey: process.env.RANDOM_ORG_API_KEY,
        n: 1,
        length: 10,
        characters: '64Nlkerxa789rtuvas1235dawer',
      },
      id: 42,
    };

    const { data } = await this.httpService.axiosRef.post<RandomAPIResponse>(
      'https://api.random.org/json-rpc/2/invoke',
      options,
    );

    return data.result.random.data[0];
  }
}
