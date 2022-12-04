import {Process, Processor} from "@nestjs/bull";
import {Job} from "bull";
import axios from "axios";
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

@Processor('reminder')
export class ReminderConsumer {
  @Process('reminder-job')
  async reminderJob(reminder: Job) {
    const chat_id = await prisma.user.findUnique({where: {user_id: reminder.data.user_id}, select: {telegram_chat_id: true}}).then(res => res.telegram_chat_id)
    const message = reminder.data.message
    const token = process.env.TELEGRAM_BOT_TOKEN
    await axios.get(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${message}`)
  }
}