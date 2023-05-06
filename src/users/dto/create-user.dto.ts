import { Transform } from 'class-transformer';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @Transform(({ value }) => value.toLowerCase())
  @IsEmail()
  username: string;

  @IsStrongPassword()
  password: string;
}
