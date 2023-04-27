import { Injectable } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEnum } from 'src/shared/enums/status.enum';
import { UserQueryOptionsDto } from './dto/user-query-options.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  saltOrRounds = 10;

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  findAll(query: UserQueryOptionsDto) {
    return this.userRepository.findAndCountAll(query);
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  findOneByUserName(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  async updateStatus(id: number, status: StatusEnum) {
    const user = new User();
    user.id = id;
    user.status = status;

    return this.userRepository.save(user);
  }

  async create(createUserDto: CreateUserDto) {
    const user = new User();

    user.password = await bcryptjs.hash(
      createUserDto.password,
      this.saltOrRounds,
    );

    user.username = createUserDto.username;

    return this.userRepository.save(user);
  }

  async updatePassword(id: number, password: string) {
    const user = new User();
    user.id = id;
    user.password = user.password = await bcryptjs.hash(
      password,
      this.saltOrRounds,
    );

    return this.userRepository.save(user);
  }
}
