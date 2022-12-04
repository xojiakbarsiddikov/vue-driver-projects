import {MiddlewareConsumer, Module} from '@nestjs/common';
import {UserModule} from './user/user.module';
import {PrismaModule} from "./prisma/prisma.module";
import {RolesModule} from "./role/roles.module";
import {AuthModule} from "./auth/auth.module";
import {HelpersModule} from "./helpers/helpers.module";
import {UploadModule} from "./upload/upload.module";
import {GlobalMiddleware} from "./util/middlewares/global.middleware";
import {ScheduleModule} from "@nestjs/schedule";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {LogModule} from './log/log.module';
import {BullModule} from "@nestjs/bull";
import {TelegramApiUpdate} from "./helpers/telegramApi.update";
import { RegionModule } from './region/region.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    RolesModule,
    HelpersModule,
    UploadModule,
    ScheduleModule.forRoot(),
    LogModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    RegionModule,
  ],
  controllers: [AppController],
  providers: [AppService, TelegramApiUpdate],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GlobalMiddleware)
      .forRoutes('*');
  }
}
