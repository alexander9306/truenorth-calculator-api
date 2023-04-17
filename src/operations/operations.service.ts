import { Injectable } from '@nestjs/common';
import { CreateOperationDto } from './dto/create-operation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Operation, OperationTypeEnum } from './entities/operation.entity';
import { User } from 'src/users/entities/user.entity';
import { Record } from 'src/records/entities/record.entity';
import { InsufficientBalanceException } from 'src/errors/exceptions/insufficient-balance.exception';
import { OperationQueryOptionsDto } from './dto/operation-query-options.dto';
import { CollectionResultDto } from 'src/shared/dto/collection-result.dto';
import { RandomAPIResponse } from './interfaces/random-api-response.interface';
import { RandomAPIOptions } from './interfaces/random-api-options.interface';

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
  private readonly defaultUserBalance = 100;

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

    record.user_balance = this.calculateNewBalance(
      operation.cost,
      lastRecord.user_balance,
    );

    if (createOperationDto.type === OperationTypeEnum.RANDOM_STRING) {
      const randomData = await this.getRandomString();

      record.operation_response = randomData;
    } else {
      record.operation_response = String(
        this.calculateOperationResponse(createOperationDto),
      );
    }

    await this.recordRepository.save(record);

    return record.operation_response;
  }

  async getCurrentBalance(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });

    const lastRecord = await this.recordRepository.findOne({
      where: {
        user,
      },
      order: {
        date: 'DESC',
      },
    });

    return {
      startedBalance: this.defaultUserBalance,
      currentBalance: lastRecord?.user_balance ?? this.defaultUserBalance,
    };
  }

  getStartingBalance() {
    return this.defaultUserBalance;
  }

  async findAll({
    pageNumber,
    pageSize,
    sortField,
    sortDirection,
    filterValue,
    filterField,
  }: OperationQueryOptionsDto): Promise<CollectionResultDto<Operation>> {
    const where = {};
    if (filterValue) {
      where[filterField] = Like(`%${filterValue}%`);
    }

    const sortColumn = {};
    sortColumn[sortField] = sortDirection;

    console.log('pageNumber', pageNumber, typeof pageNumber);
    console.log('pageSize', pageSize, typeof pageSize);

    const skip = (pageNumber - 1) * pageSize;

    const [data, count] = await Promise.all([
      this.operationRepository.find({
        where,
        skip,
        take: pageSize,
        order: sortColumn,
      }),
      this.operationRepository.count({ where }),
    ]);

    const totalPages = Math.ceil(count / pageSize);

    return {
      data,
      pageNumber,
      count,
      totalPages,
    };
  }

  private calculateNewBalance(cost: number, lastUserBalance?: number) {
    if (!lastUserBalance) {
      return this.defaultUserBalance - cost;
    }

    if (lastUserBalance - cost < 0) {
      throw new InsufficientBalanceException();
    }

    return lastUserBalance - cost;
  }

  private calculateOperationResponse({ type, num1, num2 }: CreateOperationDto) {
    switch (type) {
      case OperationTypeEnum.ADDITION:
        return num1 + num2;
      case OperationTypeEnum.SUBTRACTION:
        return num1 - num2;
      case OperationTypeEnum.MULTIPLICATION:
        return num1 - num2;
      case OperationTypeEnum.DIVISION:
        return num1 / num2;
      case OperationTypeEnum.SQUARE_ROOT:
        return Math.sqrt(num1);
    }
  }

  private async getRandomString() {
    const options: RandomAPIOptions = {
      jsonrpc: '2.0',
      method: 'generateStrings',
      params: {
        apiKey: this.configService.get<string>('RANDOM_ORG_API_KEY'),
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
