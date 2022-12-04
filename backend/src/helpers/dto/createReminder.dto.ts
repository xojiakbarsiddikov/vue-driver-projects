import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreateReminderDto {
  user_id: number

  @ApiProperty()
  @IsNotEmpty({message:"errors.isNotEmpty"})
  @IsString({message:"errors.isString"})
  message: string

  @ApiProperty()
  @IsNotEmpty({message:"errors.isNotEmpty"})
  date: number
}