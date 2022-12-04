import {InjectQueue} from "@nestjs/bull";
import {Queue} from "bull";
import {CreateReminderDto} from "../dto/createReminder.dto";

export class ReminderProducerService {
  constructor(@InjectQueue('reminder') private queue: Queue) {
  }

  async addReminder(reminderDto: CreateReminderDto) {
    const delay = reminderDto.date - +new Date()
    await this.queue.add('reminder-job', reminderDto, {delay})
  }
}