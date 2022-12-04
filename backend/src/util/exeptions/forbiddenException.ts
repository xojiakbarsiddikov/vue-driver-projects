import {HttpException} from "@nestjs/common";

export default new HttpException({
    status: 403,
    message: 'errors.403',
}, 403);