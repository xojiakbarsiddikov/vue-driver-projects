import {UserEntity} from "../../user/entities/user.entity";
import {ApiProperty, PartialType} from "@nestjs/swagger";
import {IsNotEmpty, IsString, MinLength} from "class-validator";

export class UpdateProfileDto extends PartialType(UserEntity) {
  @ApiProperty()
  @MinLength(4, {message: "errors.minLength4"})
  @IsNotEmpty({message:"errors.isNotEmpty"})
  @IsString({message:"errors.isString"})
  password?:   string
}