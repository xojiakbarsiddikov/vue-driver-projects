import {BaseEntity} from "../../util/entities/base.entity";
import { IsNotEmpty, IsNumber, IsString, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UserEntity {

    user_id: number
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null

    @ApiProperty()
    @MinLength(4, {message: "errors.minLength4"})
    @IsNotEmpty({message:"errors.isNotEmpty"})
    @IsString({message:"errors.isString"})
    password:   string

    @ApiProperty()
    roleId:     number

    @ApiProperty()
    @MinLength(4, {message: "errors.minLength4"})
    @IsNotEmpty({message:"errors.isNotEmpty"})
    @IsString({message:"errors.isString"})
    full_name:  string

    @ApiProperty()
    @MinLength(4, {message: "errors.minLength4"})
    @IsNotEmpty({message:"errors.isNotEmpty"})
    @IsString({message:"errors.isString"})
    phone:       string

    static adminRoleId = 1
    static driverRoleId = 2
}
