import { Controller, Get, Post, Body, Patch, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserStatusEnum } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  deactivate(@Param('id') id: string) {
    return this.usersService.updateStatus(+id, UserStatusEnum.INACTIVE);
  }

  @Patch(':id')
  activate(@Param('id') id: string) {
    return this.usersService.updateStatus(+id, UserStatusEnum.ACTIVE);
  }

  @Put(':id')
  password(@Param('id') id: string, @Body() updatePassDto: UpdatePasswordDto) {
    return this.usersService.updatePassword(+id, updatePassDto.password);
  }
}
