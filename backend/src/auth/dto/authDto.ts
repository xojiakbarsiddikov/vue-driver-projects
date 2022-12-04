import {IsNotEmpty, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class AuthDto {
    @ApiProperty()
    @IsNotEmpty({message: "errors.isNotEmpty"})
    @MinLength(4, {message: "errors.minLength4"})
    phone: string

    @ApiProperty()
    @IsNotEmpty({message: "errors.isNotEmpty"})
    @MinLength(4, {message: "errors.minLength4"})
    password: string
}