import { Injectable } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class LogService {
  constructor(private prismaService: PrismaService) {
  }

  create(createLogDto: CreateLogDto) {
    return this.prismaService.log.create({data: createLogDto})
  }

  async findAll(query: object) {
    const totalRecords = await this.prismaService.log.findMany({where: {...query['where']}}).then(res => res.length)
    const items = await this.prismaService.log.findMany({
      where: {...query['where']},
      take: query['take'],
      skip: query['skip'],
      orderBy: {...query['orderBy']},
    })
    return {totalRecords, items}
  }

  findOne(id: number) {
    return this.prismaService.log.findUnique({where: {id}})
  }
}
