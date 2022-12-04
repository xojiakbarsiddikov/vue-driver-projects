import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Res,
  UploadedFiles, Query
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import {FileInterceptor, FilesInterceptor} from "@nestjs/platform-express";
import {multerOptions} from "../util/uploadConfig";
import {UploadEntity} from "./entities/upload.entity";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import { Response } from 'express'
import {User_uploadEntity} from "./entities/user_upload.entity";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {BaseQueryDto} from "../util/dto/baseQuery.dto";
import {QueryParamEntity} from "../util/entities/queryParam.entity";
import {Me} from "../auth/guards/me.guard";
import forbiddenException from "../util/exeptions/forbiddenException";

@ApiBearerAuth()
@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  private tag = 'File'

  @Get('file/:fileName')
  async getFile(@Param('fileName') fileName, @Res() res: Response) {
    const file = await this.uploadService.getFileByName(fileName)
    file.pipe(res)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 100, multerOptions))
  upload(@Me() me, @UploadedFiles() files: UploadEntity[], @Body() upload_data: User_uploadEntity) {
    return this.uploadService.createMany(files, upload_data)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Me() me, @Query() queryRequest: BaseQueryDto) {
    let query = BaseQueryDto.fromRequest(queryRequest)
    return this.uploadService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.uploadService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUploadDto: UpdateUploadDto) {
    return this.uploadService.update(+id, updateUploadDto);
  }

  @Post('/delete-many')
  @UseGuards(JwtAuthGuard)
  removeMany(@Me() me, @Body('ids') ids: number[]) {
    if (!me.permissions.includes(this.tag+'.delete')) {
      throw forbiddenException;
    }
    return this.uploadService.removeMany(ids);
  }


  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Me() me, @Param('id') id: string) {
    if (!me.permissions.includes(this.tag+'.delete')) {
      throw forbiddenException;
    }
    return this.uploadService.remove(+id);
  }
}
