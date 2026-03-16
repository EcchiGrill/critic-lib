import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { type User, UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(): User[] {
    return this.userService.getUsers();
  }

  @Post()
  createUser(@Body() user: User): User {
    return this.userService.createUser(user);
  }

  @Put(':id')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: User): User {
    return this.userService.updateUser(id, user);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number): User[] {
    return this.userService.deleteUser(id);
  }
}
