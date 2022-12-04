import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import {RoleEntity} from "./entities/role.entity";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {Me} from "../auth/guards/me.guard";
import forbiddenException from "../util/exeptions/forbiddenException";

@ApiBearerAuth()
@ApiTags('Role')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  private tag = 'Role'

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Me() me, @Body() createRoleDto: CreateRoleDto) {
    if (!me.permissions.includes(this.tag+'.create')) {
      throw forbiddenException;
    }
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Me() me) {
    if (!me.permissions.includes(this.tag+'.read')) {
      throw forbiddenException;
    }
    return this.rolesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Me() me, @Param('id') id: number) {
    if (!me.permissions.includes(this.tag+'.read')) {
      throw forbiddenException;
    }
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Me() me, @Param('id') id: number, @Body() {permissions, ...updateRoleDto}: RoleEntity) {
    if (!me.permissions.includes(this.tag+'.update')) {
      throw forbiddenException;
    }
    const permissionIds = permissions?.map(permission => ({id: permission}))
    return this.rolesService.update(+id, {...updateRoleDto, Permissions: {set: permissionIds}});
  }

  @Post('/delete-many')
  @UseGuards(JwtAuthGuard)
  removeMany(@Me() me, @Body('ids') ids: number[]) {
    if (!me.permissions.includes(this.tag+'.delete')) {
      throw forbiddenException;
    }
    return this.rolesService.removeMany(ids);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Me() me, @Param('id') id: number) {
    if (!me.permissions.includes(this.tag+'.delete')) {
      throw forbiddenException;
    }
    return this.rolesService.remove(+id);
  }

}
