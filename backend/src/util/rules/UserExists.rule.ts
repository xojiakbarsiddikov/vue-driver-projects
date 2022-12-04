import {ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";
import {Injectable} from "@nestjs/common";
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class UserExistsRule implements ValidatorConstraintInterface {
  async validate(user: any, target) {
    const res = await prisma.user.findUnique({where: {username: user.username}});
    return !res || target.object.user_id === res.id;
  }

  defaultMessage(args: ValidationArguments) {
    return 'errors.unique';
  }
}