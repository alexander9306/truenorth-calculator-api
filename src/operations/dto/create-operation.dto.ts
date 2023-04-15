import { OperationTypeEnum } from '../entities/operation.entity';
import { IsEnum, IsNumber, ValidateIf } from 'class-validator';

export class CreateOperationDto {
  @IsEnum(OperationTypeEnum)
  type: OperationTypeEnum;

  @ValidateIf((v) => v.type !== OperationTypeEnum.RANDOM_STRING)
  @IsNumber()
  value1?: number;

  @ValidateIf(
    (v) =>
      v.type !== OperationTypeEnum.RANDOM_STRING ||
      v.type !== OperationTypeEnum.SQUARE_ROOT,
  )
  @IsNumber()
  value2?: number;
}
