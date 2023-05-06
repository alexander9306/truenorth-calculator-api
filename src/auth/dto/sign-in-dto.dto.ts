import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class SignInDto {
  @Transform(({ value }) => value.toLowerCase())
  @IsString()
  username: string;

  @IsString()
  password: string;
}
