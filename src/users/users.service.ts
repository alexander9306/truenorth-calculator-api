import {
  ClassSerializerInterceptor,
  Injectable,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User, UserStatusEnum } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  findOneByUserName(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  async updateStatus(id: number, status: UserStatusEnum) {
    const userToUpdate = await this.userRepository.findOneBy({ id });
    userToUpdate.status = status;

    return this.userRepository.save(userToUpdate);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userToUpdate = await this.userRepository.findOneBy({ id });

    if (updateUserDto.username) userToUpdate.username = updateUserDto.username;
    if (updateUserDto.password) userToUpdate.password = updateUserDto.password;

    return this.userRepository.save(userToUpdate);
  }
}
