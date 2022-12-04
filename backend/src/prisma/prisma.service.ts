import {Injectable, OnModuleInit} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import notFoundException from "../util/exeptions/notFoundException";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  [x: string]: any;
  async onModuleInit() {
    await this.$use(async (params, next) => {
      const result = await next(params)
      if (result === null) {
        throw notFoundException
      }
      return result
    })
    await this.$connect();
  }

}
