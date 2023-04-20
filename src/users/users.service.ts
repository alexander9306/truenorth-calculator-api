import { Injectable } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEnum } from 'src/shared/enums/status.enum';
import { UserQueryOptionsDto } from './dto/user-query-options.dto';
import { CollectionResultDto } from 'src/shared/dto/collection-result.dto';

@Injectable()
export class UsersService {
  saltOrRounds = 10;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll({
    pageNumber,
    pageSize,
    sortField,
    sortDirection,
    filterValue,
    filterField,
  }: UserQueryOptionsDto): Promise<CollectionResultDto<User>> {
    const where = {};
    if (filterValue) {
      where[filterField] = Like(`%${filterValue}%`);
    }

    const sortColumn = {};
    sortColumn[sortField] = sortDirection;

    const skip = (pageNumber - 1) * pageSize;

    const [data, count] = await Promise.all([
      this.userRepository.find({
        where,
        skip,
        take: pageSize,
        order: sortColumn,
      }),
      this.userRepository.count({ where }),
    ]);

    const totalPages = Math.ceil(count / pageSize);

    return {
      data,
      pageNumber,
      count,
      totalPages,
    };
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
