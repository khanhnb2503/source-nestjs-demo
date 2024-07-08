import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ParseObjectIdPipe } from '~/src/pipe';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { API_OPERATION_ACTION } from './swagger';

@ApiTags('USERS')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOperation(API_OPERATION_ACTION.CREATE)
  @Post('/create')
  async create(@Body() createUserDto: CreateUserDto) {
    const response = await this.userService.create(createUserDto);
    return response;
  }

  @ApiOperation(API_OPERATION_ACTION.LIST)
  @Get('/list')
  async findAll() {
    const users = await this.userService.findAll();
    return users;
  }

  @ApiOperation(API_OPERATION_ACTION.DETAIL)
  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    const user = await this.userService.findOne(id);
    return user;
  }

  @ApiOperation(API_OPERATION_ACTION.UPDATE)
  @Put(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateUserDto: CreateUserDto
  ) {
    const user = await this.userService.update(id, updateUserDto);
    return user;
  }

  @ApiOperation(API_OPERATION_ACTION.DELETE)
  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    const user = await this.userService.remove(id);
    return user;
  }
}
