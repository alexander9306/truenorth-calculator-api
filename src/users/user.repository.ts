import { BaseRepository } from 'src/shared/base-repository.repository';
import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.manager);
  }
}
