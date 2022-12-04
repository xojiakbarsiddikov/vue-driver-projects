import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {ModuleRef} from "@nestjs/core";
import {JwtService} from "@nestjs/jwt";
import {AuthDto} from "./dto/authDto";
import {UpdateProfileDto} from "./dto/updateProfile.dto";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class AuthService {
    private userService: UserService;

    constructor(private moduleRef: ModuleRef, private jwtService: JwtService, private prismaService: PrismaService) {
        this.userService = this.moduleRef.get(UserService, {strict: false})
    }

    async validateUser({phone, password}: AuthDto) {
        const user = await this.userService.findOneByPhone({phone, password})
        if (!user || user.password !== password) {
            return false
        }
        delete user.password
        return user
    }

    async sign(authDto: AuthDto) {
        const user = await this.validateUser(authDto).then((data) => {
            return data
        })
        if (user) {
            return {
                token: this.jwtService.sign(user)
            }
        }
        throw new UnauthorizedException()
    }

    update(user: UpdateProfileDto) {
        return this.prismaService.user.update({where: {user_id: user.user_id}, data: user})
    }
}
