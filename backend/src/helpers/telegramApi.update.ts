import {Help, On, Start, Update} from "nestjs-telegraf";
import {Context} from "telegraf";
import {Buffer} from "buffer";
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

@Update()
export class TelegramApiUpdate {

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Welcome');
  }

  @Help()
  async helpCommand(ctx: Context) {
    await ctx.reply('Send me a sticker');
  }

  @On('text')
  async hearsHi(ctx: Context) {
    let reply = 'User linked'

    const message = ctx.message['text']
    const username = Buffer.from(message, 'base64').toString('ascii')
    const user = await prisma.user.update({where: {username}, data: {telegram_chat_id: ctx.message.from.id.toString()}})
    if (!user) {
      reply = 'No user found'
    }
    await ctx.reply(reply);
  }
}
