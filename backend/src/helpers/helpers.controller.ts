import {Body, Controller, Get, Post, Request, UseGuards} from "@nestjs/common";
import {getTraslates} from "../util"
import {ReminderProducerService} from "./services/reminder.producer.service";
import {CreateReminderDto} from "./dto/createReminder.dto";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {Me} from "../auth/guards/me.guard";
import {HelpersService} from "./helpers.service";

@Controller('helpers')
export class HelpersController {
    constructor(private reminderService: ReminderProducerService, private helperService: HelpersService) {}
    @Get('get-translates')
    async getTranslates(@Request() req) {
        return getTraslates()
    }

    @Post('/add-reminder')
    @UseGuards(JwtAuthGuard)
    async addReminder(@Me() me, @Body() reminderDto: CreateReminderDto) {
        reminderDto.user_id = me.user_id
        await this.reminderService.addReminder(reminderDto)
    }
}