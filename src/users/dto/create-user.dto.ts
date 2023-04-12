import { IsEmail, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  username: string;

  @IsStrongPassword()
  password: string;
}
