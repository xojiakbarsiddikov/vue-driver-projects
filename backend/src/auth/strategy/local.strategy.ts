import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-local";
import {AuthService} from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: "username"
        })
    }

    async validate(phone, password) {
        const user = await this.authService.validateUser({phone, password})
        if (user === null) {
            throw new UnauthorizedException()
        }
        return user
    }
}