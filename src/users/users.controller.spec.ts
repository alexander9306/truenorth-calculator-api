import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserQueryOptionsDto } from './dto/user-query-options.dto';
import { StatusEnum } from 'src/shared/enums/status.enum';
import { UpdatePasswordDto } from './dto/update-password.dto';

const mockUserService = () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  updateStatus: jest.fn(),
  updatePassword: jest.fn(),
});

describe('UsersController', () => {
  let controller: UsersController;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useFactory: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('findAll', () => {
    it('should call userService.findAll with userOptionsDto', async () => {
      const userOptionsDto = new UserQueryOptionsDto();
      const findAllSpy = jest.spyOn(userService, 'findAll');

      await controller.findAll(userOptionsDto);

      expect(findAllSpy).toHaveBeenCalledWith(userOptionsDto);
    });
  });

  describe('getUserInfo', () => {
    it('should call userService.findOne with userId', async () => {
      const userId = 1;
      const findOneSpy = jest.spyOn(userService, 'findOne');

      await controller.getUserInfo(userId);

      expect(findOneSpy).toHaveBeenCalledWith(userId);
    });
  });

  describe('deactivate', () => {
    it('should call userService.updateStatus with id and StatusEnum.INACTIVE', async () => {
      const id = '1';
      const updateStatusSpy = jest.spyOn(userService, 'updateStatus');

      await controller.deactivate(id);

      expect(updateStatusSpy).toHaveBeenCalledWith(+id, StatusEnum.INACTIVE);
    });
  });

  describe('activate', () => {
    it('should call userService.updateStatus with id and StatusEnum.ACTIVE', async () => {
      const id = '1';
      const updateStatusSpy = jest.spyOn(userService, 'updateStatus');

      await controller.activate(id);

      expect(updateStatusSpy).toHaveBeenCalledWith(+id, StatusEnum.ACTIVE);
    });
  });

  describe('changePassword', () => {
    it('should call userService.updatePassword with id and updatePassDto.password', async () => {
      const id = 1;
      const updatePassDto = new UpdatePasswordDto();
      const updatePasswordSpy = jest.spyOn(userService, 'updatePassword');

      await controller.changePassword(id, updatePassDto);

      expect(updatePasswordSpy).toHaveBeenCalledWith(
        id,
        updatePassDto.password,
      );
    });
  });
});
