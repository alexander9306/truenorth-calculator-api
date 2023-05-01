import { OperationTypeEnum } from '../entities/operation.entity';
import { IsEnum, IsNumber, Max, Min, ValidateIf } from 'class-validator';

export class CreateOperationDto {
  @IsEnum(OperationTypeEnum)
  type: OperationTypeEnum;

  @ValidateIf((v) => v.type !== OperationTypeEnum.RANDOM_STRING)
  @Min(Number.MIN_SAFE_INTEGER)
  @Max(Number.MAX_SAFE_INTEGER)
  @IsNumber()
  num1?: number;

  @ValidateIf(
    (v) =>
      v.type !== OperationTypeEnum.RANDOM_STRING &&
      v.type !== OperationTypeEnum.SQUARE_ROOT,
  )
  @Min(Number.MIN_SAFE_INTEGER)
  @Max(Number.MAX_SAFE_INTEGER)
  @IsNumber()
  num2?: number;
}
