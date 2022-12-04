import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {PassportModule} from "@nestjs/passport";
import {LocalStrategy} from "./strategy/local.strategy";
import {JwtModule} from "@nestjs/jwt";
import {JwtConstants} from "./constants";
import {JwtStrategy} from "./strategy/jwt.strategy";
import {PermissionsModule} from "../permission/permissions.module";

@Module({
    imports: [
        PassportModule, JwtModule.register({
            secret: JwtConstants.secretKey,
            signOptions: {expiresIn: '8h'}
        }),
        PermissionsModule
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    controllers: [AuthController]
})
export class AuthModule {
}
