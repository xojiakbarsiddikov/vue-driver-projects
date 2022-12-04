import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PermissionsService {
  constructor(private prismaService: PrismaService) {}

  create(createPermissionDto: Prisma.permissionUncheckedCreateInput) {
    return this.prismaService.permission.create({ data: createPermissionDto });
  }

  findAll() {
    return this.prismaService.permission.findMany();
  }

  findOne(id: number) {
    return this.prismaService.permission.findUnique({ where: { id } });
  }

  update(id: number, updatePermissionDto: Prisma.permissionUncheckedUpdateInput) {
    return this.prismaService.permission.update({
      data: updatePermissionDto,
      where: { id },
    });
  }

  remove(id: number) {
    return this.prismaService.permission.delete({ where: { id } });
  }
}
