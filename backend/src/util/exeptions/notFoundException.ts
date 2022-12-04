import {HttpException} from "@nestjs/common";

export default new HttpException({
    status: 404,
    message: 'errors.404',
}, 404);