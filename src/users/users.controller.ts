import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { updateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';

import { CurrentUser } from './decorators/current-user.decorator';

import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('user')
@Serialize(UserDto)
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('/whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Get('/checking')
  checkingPurpose() {
    return "you're authenticated.";
  }

  @UseGuards(AdminGuard)
  @Get('/admin')
  admin() {
    return "you're admin.";
  }

  @UseGuards(AdminGuard)
  @Get('/makeAdmin/:id')
  makeAdmin(@Param('id') id: string) {
    return this.userService.makeAdmin(parseInt(id));
  }

  @UseGuards(AdminGuard)
  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.userService.findOne(parseInt(id));
  }

  @UseGuards(AdminGuard)
  @Get()
  findAllUsers() {
    return this.userService.find();
  }

  @UseGuards(AdminGuard)
  @Get()
  findUsers(@Query('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: updateUserDto) {
    return this.userService.update(parseInt(id), body);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }
}
