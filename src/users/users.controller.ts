import { Controller, Get, Body, Patch, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserId } from 'src/shared/decorators/user-id.decorator';
import { StatusEnum } from 'src/shared/enums/status.enum';

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
    return this.usersService.updateStatus(id, StatusEnum.INACTIVE);
  }

  @Patch()
  activate(@UserId() id: number) {
    return this.usersService.updateStatus(id, StatusEnum.ACTIVE);
  }

  @Put()
  password(@UserId() id: number, @Body() updatePassDto: UpdatePasswordDto) {
    return this.usersService.updatePassword(id, updatePassDto.password);
  }
}
