import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import {UpdatePermissionsDto} from "./dto/update-role.permissions";
import {PermissionsService} from "./permissions.service";
import PermissionsEntity from "./entities/permissions.entity";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {Me} from "../auth/guards/me.guard";
import forbiddenException from "../util/exeptions/forbiddenException";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";

@ApiBearerAuth()
@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly rolesService: PermissionsService) {}

  private tag = 'Permission'

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Me() me, @Body() {Role, ...createPermission}: PermissionsEntity) {
    if (!me.permissions.includes(this.tag+'.create')) {
      throw forbiddenException;
    }
    return this.rolesService.create(createPermission);
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
  findOne(@Me() me, @Param('id') id: string) {
    if (!me.permissions.includes(this.tag+'.read')) {
      throw forbiddenException;
    }
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Me() me, @Param('id') id: string, @Body() {roleIds, ...updatePermissionDto}: UpdatePermissionsDto) {
    if (!me.permissions.includes(this.tag+'.update')) {
      throw forbiddenException;
    }
    return this.rolesService.update(+id, {...updatePermissionDto, Role: {connect: roleIds}});
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Me() me, @Param('id') id: string) {
    if (!me.permissions.includes(this.tag+'.delete')) {
      throw forbiddenException;
    }
    return this.rolesService.remove(+id);
  }
}
