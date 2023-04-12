import { Controller, Get, Body, Patch, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserStatusEnum } from './entities/user.entity';
import { UserId } from 'src/shared/decorators/user-id.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch()
  deactivate(@UserId() id: number) {
    return this.usersService.updateStatus(id, UserStatusEnum.INACTIVE);
  }

  @Patch()
  activate(@UserId() id: number) {
    return this.usersService.updateStatus(id, UserStatusEnum.ACTIVE);
  }

  @Put()
  password(@UserId() id: number, @Body() updatePassDto: UpdatePasswordDto) {
    return this.usersService.updatePassword(id, updatePassDto.password);
  }
}
