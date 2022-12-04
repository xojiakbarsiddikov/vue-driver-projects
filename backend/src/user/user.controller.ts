import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import forbiddenException from "../util/exeptions/forbiddenException";
import {Me} from "../auth/guards/me.guard";
import {BaseQueryDto} from "../util/dto/baseQuery.dto";

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  private tag = 'User'

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Me() me, @Body() createUserDto: CreateUserDto) {
    if (!me.permissions.includes(this.tag+'.create')) {
      throw forbiddenException;
    }
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Me() me, @Query() queryRequest: BaseQueryDto) {
    let query = BaseQueryDto.fromRequest(queryRequest)
    if (!me.permissions.includes(this.tag+'.read')) {
      throw forbiddenException;
    }
    return this.userService.findAll(query);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Me() me, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (!me.permissions.includes(this.tag+'.update')) {
      throw forbiddenException;
    }
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Me() me, @Param('id') id: string) {
    if (!me.permissions.includes(this.tag+'.delete')) {
      throw forbiddenException;
    }
    return this.userService.remove(+id);
  }

  @Post('/delete-many')
  @UseGuards(JwtAuthGuard)
  removeMany(@Body('ids') ids: number[]) {
    return this.userService.removeMany(ids);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Me() me, @Param('id') id: string) {
    if (!me.permissions.includes(this.tag+'.read')) {
      throw forbiddenException;
    }
    return this.userService.findOne(+id);
  }
}
