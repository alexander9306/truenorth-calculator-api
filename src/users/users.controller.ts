import {
  Controller,
  Get,
  Body,
  Patch,
  Put,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserId } from 'src/shared/decorators/user-id.decorator';
import { StatusEnum } from 'src/shared/enums/status.enum';
import { UserQueryOptionsDto } from './dto/user-query-options.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get()
  findAll(@Query() userOptionsDto: UserQueryOptionsDto) {
    return this.usersService.findAll(userOptionsDto);
  }

  @Get('info')
  getUserInfo(@UserId('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Patch('deactivate')
  deactivate(@UserId() id: number) {
    return this.usersService.updateStatus(id, StatusEnum.INACTIVE);
  }

  @Patch('activate')
  activate(@UserId() id: number) {
    return this.usersService.updateStatus(id, StatusEnum.ACTIVE);
  }

  @Put('change/password')
  changePassword(
    @UserId() id: number,
    @Body() updatePassDto: UpdatePasswordDto,
  ) {
    return this.usersService.updatePassword(id, updatePassDto.password);
  }
}
