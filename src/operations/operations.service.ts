import { Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOperationDto } from './dto/create-operation.dto';
import { OperationTypeEnum } from './entities/operation.entity';
import { User } from 'src/users/entities/user.entity';
import { Record } from 'src/records/entities/record.entity';
import { InsufficientBalanceException } from 'src/errors/exceptions/insufficient-balance.exception';
import { OperationQueryOptionsDto } from './dto/operation-query-options.dto';
import { OperationRepository } from './operation.repository';
import { RecordRepository } from 'src/records/record.repository';
import { StatusEnum } from 'src/shared/enums/status.enum';
import { RandomService } from './random/random.service';

@Injectable()
export class OperationsService {
  // Default User Balance
  private readonly defaultUserBalance =
    Number.parseInt(process.env.DEFAULT_BALANCE, 10) || 150;

  private readonly bigNumber = BigNumber;

  constructor(
    @InjectRepository(OperationRepository)
    private operationRepository: OperationRepository,

    @InjectRepository(RecordRepository)
    private recordRepository: RecordRepository,

    private randomService: RandomService,
  ) {
    // Set a maximum of 10 decimal places
    this.bigNumber.set({ DECIMAL_PLACES: 10 });
  }

  async create(userId: number, createOperationDto: CreateOperationDto) {
    const record = new Record();
    const user = new User();
    user.id = userId;

    const [operation, amountTotal] = await Promise.all([
      this.operationRepository.findOneBy({ type: createOperationDto.type }),
      this.getAmountTotal(user.id),
    ]);

    record.user = user;
    record.operation = operation;
    record.amount = operation.cost;
    record.user_balance = this.calculateBalance(operation.cost, amountTotal);
    record.operation_response =
      createOperationDto.type === OperationTypeEnum.RANDOM_STRING
        ? await this.randomService.generateString()
        : this.calculateResult(createOperationDto);

    await this.recordRepository.save(record);

    return { result: record.operation_response };
  }

  async getAmountTotal(userId: number) {
    const userRecords = await this.recordRepository.find({
      where: {
        user: {
          id: userId,
        },
        status: StatusEnum.ACTIVE,
      },
    });

    return userRecords.reduce<number>(
      (previous, current) => previous + current.amount,
      0,
    );
  }

  async getUserBalance(userId: number) {
    const amountTotal = await this.getAmountTotal(userId);

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
}
