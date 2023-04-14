import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEnum } from 'src/shared/enums/status.enum';
import { UserOptionsDto } from './dto/user-options.dto';
import { PaginatedDataDto } from 'src/shared/dto/paginated-data.dto';

@Injectable()
export class UsersService {
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
    skip,
  }: UserOptionsDto): Promise<PaginatedDataDto<User>> {
    const where = {};
    if (filterValue) {
      where[filterField] = Like(`%${filterValue}%`);
    }

    const sortColumn = {};
    sortColumn[sortField] = sortDirection;

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

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.password = createUserDto.password;
    user.username = createUserDto.username;

    return this.userRepository.save(user);
  }

  updatePassword(id: number, password: string) {
    const user = new User();
    user.id = id;
    user.password = password;

    return this.userRepository.save(user);
  }
}
