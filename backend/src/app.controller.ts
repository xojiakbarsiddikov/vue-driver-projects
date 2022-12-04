import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Get, Post, Query, Request} from "@nestjs/common";
import {AppService} from "./app.service";
import {Request as Req} from "express";

@ApiBearerAuth()
@ApiTags('App')
@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) {
  }
}