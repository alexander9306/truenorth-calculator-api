import {
  Controller,
  Get,
  Body,
  Patch,
  Put,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  Param,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserId } from 'src/shared/decorators/user-id.decorator';
import { StatusEnum } from 'src/shared/enums/status.enum';
import { UserQueryOptionsDto } from './dto/user-query-options.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true }))
    userOptionsDto: UserQueryOptionsDto,
  ) {
    return this.usersService.findAll(userOptionsDto);
  }

  @Get('info')
  getUserInfo(@UserId() userId: number) {
    return this.usersService.findOne(userId);
  }

  @Patch('deactivate/:id')
  deactivate(@Param() id: string) {
    return this.usersService.updateStatus(+id, StatusEnum.INACTIVE);
  }

  @Patch('activate/:id')
  activate(@Param() id: string) {
    return this.usersService.updateStatus(+id, StatusEnum.ACTIVE);
  }

  @Put('password')
  changePassword(
    @UserId() userId: number,
    @Body() updatePassDto: UpdatePasswordDto,
  ) {
    return this.usersService.updatePassword(userId, updatePassDto.password);
  }
}
