import {Controller, Get, Post, Body, Param, UseGuards, Query} from '@nestjs/common';
import { LogService } from './log.service';
import { CreateLogDto } from './dto/create-log.dto';
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {Me} from "../auth/guards/me.guard";
import {BaseQueryDto} from "../util/dto/baseQuery.dto";
import forbiddenException from "../util/exeptions/forbiddenException";

@Controller('log')
export class LogController {
  private tag = 'Log'
  constructor(private readonly logService: LogService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Me() me, @Body() createLogDto: CreateLogDto) {
    if (!me.permissions.includes(this.tag+'.create')) {
      throw forbiddenException;
    }
    return this.logService.create(createLogDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Me() me, @Query() queryRequest: BaseQueryDto) {
    if (!me.permissions.includes(this.tag+'.read')) {
      throw forbiddenException;
    }
    let query = BaseQueryDto.fromRequest(queryRequest)
    return this.logService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Me() me, @Param('id') id: string) {
    if (!me.permissions.includes(this.tag+'.read')) {
      throw forbiddenException;
    }
    return this.logService.findOne(+id);
  }
}
