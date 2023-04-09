import { OperationTypeEnum } from '../entities/operation.entity';
import { IsEnum, IsNumberString, ValidateIf } from 'class-validator';

export class CreateOperationDto {
  @IsEnum(OperationTypeEnum)
  type: OperationTypeEnum;

  @IsNumberString()
  value1: number;

  @IsNumberString()
  @ValidateIf((v) => v.value1 !== OperationTypeEnum.RANDOM_STRING)
  value2?: number;
}
