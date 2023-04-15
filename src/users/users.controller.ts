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

  @Get()
  findAll(@Query() userOptionsDto: UserQueryOptionsDto) {
    return this.usersService.findAll(userOptionsDto);
  }

  @Get('getInfo')
  getUserInfo(@UserId('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Patch('deactivate/:id')
  deactivate(@Param() id: string) {
    return this.usersService.updateStatus(+id, StatusEnum.INACTIVE);
  }

  @Patch('activate/:id')
  activate(@Param() id: string) {
    return this.usersService.updateStatus(+id, StatusEnum.ACTIVE);
  }

  @Put('changePassword')
  changePassword(
    @UserId() id: number,
    @Body() updatePassDto: UpdatePasswordDto,
  ) {
    return this.usersService.updatePassword(id, updatePassDto.password);
  }
}
