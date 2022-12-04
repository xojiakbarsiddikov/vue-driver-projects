import {BaseEntity} from "../../util/entities/base.entity";
import {IsNotEmpty, IsString, Min, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class RoleEntity extends BaseEntity {
    @ApiProperty()
    @MinLength(4, {message: "errors.minLength4"})
    @IsNotEmpty({message:"errors.isNotEmpty"})
    @IsString({message:"errors.isString"})
    tag: string

    @ApiProperty()
    @IsString({message:"errors.isString"})
    description: string
    permissions: []
}
