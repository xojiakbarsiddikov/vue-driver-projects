import {BaseEntity} from "../../util/entities/base.entity";
import {IsNotEmpty, IsString, MinLength} from "class-validator";

export default class PermissionsEntity extends BaseEntity {
    @MinLength(4, {message: "errors.minLength4"})
    @IsNotEmpty({message:"errors.isNotEmpty"})
    @IsString({message:"errors.isString"})
    tag: string

    @IsString({message:"errors.isString"})
    description: string

    roleIds: []
    Role: number[]
}
