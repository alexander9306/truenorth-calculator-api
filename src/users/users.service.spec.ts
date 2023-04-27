import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserQueryOptionsDto } from './dto/user-query-options.dto';
import { CollectionResultDto } from 'src/shared/dto/collection-result.dto';
import { StatusEnum } from 'src/shared/enums/status.enum';
import * as bcryptjs from 'bcryptjs';
import { UserRepository } from './user.repository';

// Mock the UserRepository
const mockUserRepository = () => ({
  findAndCountAll: jest.fn(),
  find: jest.fn(),
  count: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
});

jest.mock('bcryptjs');
describe('UsersService', () => {
  let userService: UsersService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return collection result of users', async () => {
      const user1 = new User();
      user1.id = 1;
      user1.username = 'user1';

      const user2 = new User();
      user2.id = 2;
      user2.username = 'user2';

      const users = [user1, user2];
      const count = users.length;
      const totalPages = 1;

      const collectionResult: CollectionResultDto<User> = {
        data: users,
        pageNumber: 1,
        count,
        totalPages,
      };

      (userRepository as any).findAndCountAll.mockResolvedValue(
        collectionResult,
      );

      const queryOptions: UserQueryOptionsDto = {
        pageNumber: 1,
        pageSize: 10,
        sortField: 'id',
        sortDirection: 'ASC',
      };

      const result = await userService.findAll(queryOptions);

      expect(userRepository.findAndCountAll).toHaveBeenCalledWith(queryOptions);
      expect(result).toEqual(collectionResult);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = new User();
      user.id = 1;
      user.username = 'user1';

      (userRepository as any).findOneBy.mockResolvedValue(user);

      const result = await userService.findOne(1);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(user);
    });
  });

  describe('findOneByUserName', () => {
    it('should return a user by username', async () => {
      const user = new User();
      user.id = 1;
      user.username = 'user1';

      (userRepository as any).findOneBy.mockResolvedValue(user);

      const result = await userService.findOneByUserName('user1');

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        username: 'user1',
      });
      expect(result).toEqual(user);
    });
  });
  describe('updateStatus', () => {
    it('should update the user status', async () => {
      const userId = 1;
      const newStatus = StatusEnum.INACTIVE;
      const user = new User();
      user.id = userId;
      user.status = StatusEnum.ACTIVE;

      (userRepository as any).save.mockResolvedValue({
        ...user,
        status: newStatus,
      });

      const result = await userService.updateStatus(userId, newStatus);

      expect(userRepository.save).toBeCalledWith({
        ...user,
        status: newStatus,
      });
      expect(result).toEqual({ ...user, status: newStatus });
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const newUser = {
        username: 'john.doe@example.com',
        password: 'password123',
      };
      const createdUser = new User();
      createdUser.id = 1;
      createdUser.username = newUser.username;
      createdUser.password = newUser.password;
      createdUser.status = StatusEnum.ACTIVE;

      (bcryptjs.hash as jest.Mock).mockResolvedValue(newUser.password);

      (userRepository as any).save.mockResolvedValue(createdUser);

      const result = await userService.create(newUser);

      expect(userRepository.save).toBeCalledWith(newUser);
      expect(result).toEqual(createdUser);
    });
  });

  describe('updatePassword', () => {
    it('should update the user password', async () => {
      const userId = 1;
      const newPassword = 'newpassword123';
      const user = new User();
      user.id = userId;
      user.password = 'oldpassword123';

      (bcryptjs.hash as jest.Mock).mockResolvedValue(newPassword);
      (userRepository as any).save.mockResolvedValue({
        ...user,
        password: newPassword,
      });

      const result = await userService.updatePassword(userId, newPassword);

      expect(userRepository.save).toBeCalledWith({
        ...user,
        password: newPassword,
      });
      expect(result).toEqual({
        ...user,
        password: newPassword,
      });
    });
  });
});
