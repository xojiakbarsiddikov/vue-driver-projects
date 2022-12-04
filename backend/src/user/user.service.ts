import {Injectable} from '@nestjs/common';
import {Prisma} from '@prisma/client';
import {PrismaService} from "../prisma/prisma.service";
import {AuthDto} from "../auth/dto/authDto";
import {QueryParamEntity} from "../util/entities/queryParam.entity";
import {prepareRowQuery} from "../util";

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {
  }

  create(createUserDto: Prisma.userUncheckedCreateInput) {
    return this.prismaService.user.create({data: createUserDto});
  }

  async findAll(query: object) {
    const totalRecords = await this.prismaService.user.findMany({where: {...query['where']}}).then(res => res.length)
    const items = await this.prismaService.user.findMany({
      where: {...query['where']},
      take: query['take'],
      skip: query['skip'],
      orderBy: {...query['orderBy']},
    })
    return {totalRecords, items}
  }

  async filter(query: QueryParamEntity, table) {
    return await prepareRowQuery(query, this.prismaService, table)
  }

  findOne(user_id: number) {
    return this.prismaService.user.findUnique({where: {user_id}});
  }

  async findOneByPhone({phone}: AuthDto) {
    return await this.prismaService.user.findUnique({where: {phone}})
  }

  update(user_id: number, updateUserDto: Prisma.userUncheckedUpdateInput) {
    return this.prismaService.user.update({data: updateUserDto, where: {user_id}})
  }

  remove(user_id: number) {
    return this.prismaService.user.delete({where: {user_id}});
  }

  removeMany(ids: number[]) {
    return this.prismaService.user.deleteMany({
      where: {
        user_id: {in: ids}
      }
    })
  }

  // async groupStudentService(user_id: number) {
  //   const groupIds = await this.prismaService.group_student.findMany({where: {user_id}, select: {group_id: true}}).then(res => {
  //     return res.map(item => item.group_id)
  //   })
  //   return await this.prismaService.group.findMany({where: {id: {in: groupIds}}, include: {teacher: true, course: true}})
  // }
}
