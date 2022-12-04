import {HttpException} from "@nestjs/common";

export default new HttpException({
  status: 303,
  message: 'errors.org404'
}, 404)