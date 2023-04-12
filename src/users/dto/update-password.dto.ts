import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdatePasswordDto extends OmitType(PartialType(CreateUserDto), [
  'username',
] as const) {}
