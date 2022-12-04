import {IsNumber, IsString} from "class-validator";
import {BaseEntity} from "../../util/entities/base.entity";

export class UploadEntity extends BaseEntity {
    @IsString({message:"errors.isString"})
    fieldname: string

    @IsString({message:"errors.isString"})
    originalname: string

    @IsString({message:"errors.isString"})
    encoding: string

    @IsString({message:"errors.isString"})
    mimetype: string

    @IsString({message:"errors.isString"})
    destination: string

    @IsString({message:"errors.isString"})
    filename: string

    @IsString({message:"errors.isString"})
    path:  string

    @IsString({message:"errors.isString"})
    nameMini:  string

    @IsNumber({}, {message:"errors.isNumber"})
    size: number

    @IsString({message:"errors.isString"})
    tag?: string

    @IsString({message:"errors.isString"})
    entity?: string

    @IsNumber({}, {message:"errors.IsSelected"})
    entity_id?: number

    @IsNumber({}, {message:"errors.IsSelected"})
    user_id: number

}
