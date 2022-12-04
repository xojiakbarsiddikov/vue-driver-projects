import {Module} from '@nestjs/common';
import {HelpersController} from "./helpers.controller";
import {HelpersService} from "./helpers.service";
import {ReminderProducerService} from "./services/reminder.producer.service";
import {ReminderConsumer} from "./consumers/reminder.consumer";
import {BullModule} from "@nestjs/bull";

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'reminder'
    })
  ],
  controllers: [HelpersController],
  providers: [HelpersService, ReminderProducerService, ReminderConsumer],
  exports: [HelpersService],
})
export class HelpersModule {
}