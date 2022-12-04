import {ExceptionFilter, Catch, ArgumentsHost, HttpException} from '@nestjs/common';
import {Request, Response} from 'express';
import * as _ from "lodash"
import {getTraslate} from "../index";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const fields = exception.getResponse()
        const currentLang = request.query.lang

        if (typeof fields === "object" && Object.keys(fields).length) {
            _.forEach(fields, (field, key) => {
                if (typeof field === "object" && Object.keys(field).length) {
                    _.forEach(field, (item, key_2) => {
                        fields[key][key_2] = getTraslate(currentLang.toString(), item.toString())
                    })
                }
            })
        }

        response
            .status(status)
            .json(fields);
    }
}