import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InvalidCredentialsException } from 'src/errors/exceptions/invalid-credentials.exception';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './interfaces/jwt.payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUserName(username);

    const isMatch = user && (await bcrypt.compare(pass, user.password));

    if (!isMatch) {
      throw new InvalidCredentialsException();
    }

    const payload: JwtPayload = { sub: user.id, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
