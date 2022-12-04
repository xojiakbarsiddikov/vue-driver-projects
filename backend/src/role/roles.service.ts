import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as _ from 'lodash';

@Injectable()
export class RolesService {
  constructor(
    private prismaService: PrismaService,
  ) {}

  private tag = 'Role'

  create(createRoleDto: Prisma.roleUncheckedCreateInput) {
    return this.prismaService.role.create({ data: createRoleDto });
  }

  async findAll() {
    return this.prismaService.role.findMany();
  }

  findOne(id: number) {
    return this.prismaService.role.findUnique({ where: { id } });
  }

  update(id: number, updateRoleDto: Prisma.roleUncheckedUpdateInput) {
    return this.prismaService.role.update({
      data: updateRoleDto,
      where: { id },
    });
  }

  remove(id: number) {
    return this.prismaService.role.delete({ where: { id } });
  }

  removeMany(ids: number[]) {
    return this.prismaService.role.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async getRolePermissionsById(roleId: number) {
    const [permissions] = await Promise.all([
      this.prismaService.role
        .findUnique({
          where: { id: roleId },
          include: { Permissions: true },
        })
        .then((data) => {
          return _.map(data.Permissions, 'tag');
        }),
    ]);
    return permissions;
  }
}
