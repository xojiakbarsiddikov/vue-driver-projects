import {PassportStrategy} from "@nestjs/passport";
import {Injectable} from "@nestjs/common";
import {ExtractJwt, Strategy} from "passport-jwt";
import {JwtConstants} from "../constants";
import {PrismaService} from "../../prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private prismaService: PrismaService ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JwtConstants.secretKey,
            ignoreExpiration: false,
        });
    }

    async validate(payload) {
        const rolePermissions = await this.prismaService.role.findUnique({where: {id: payload.roleId}}).Permissions();
        const permissions = []
        rolePermissions.forEach(item => {
            permissions.push(item.tag)
        })
        payload.permissions = permissions
        return payload
    }
}