import {Body, Controller, Get, Post, Response, Request, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import {Me} from "./guards/me.guard";
import {AuthDto} from "./dto/authDto";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {UpdateProfileDto} from "./dto/updateProfile.dto";
import forbiddenException from "../util/exeptions/forbiddenException";

@ApiBearerAuth()
@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Post('login')
    async login(@Body() authDto: AuthDto, @Response() res, @Request() req) {
        return res.status(200).send(await this.authService.sign(authDto))
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    profile(@Me() me) {
        return me
    }

    @Post('profile')
    @UseGuards(JwtAuthGuard)
    updateProfile(@Me() me, @Body() user: UpdateProfileDto) {
        delete user['permissions']
        delete user['iat']
        delete user['exp']
        if (me.user_id !== user.user_id) {
            throw forbiddenException;
        }
        return this.authService.update(user)
    }
}
