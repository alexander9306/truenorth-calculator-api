import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
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

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

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
      where[filterField] = filterValue;
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

  updateStatus(id: number, status: StatusEnum) {
    return this.userRepository.save({
      id,
      status,
    });
  }

  updatePassword(id: number, password: string) {
    return this.userRepository.save({
      id,
      password,
    });
  }
}
