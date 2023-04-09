import { IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  username: string;

  @Length(3, 50)
  password: string;
}
