import {Injectable} from '@nestjs/common';
import {Prisma} from '@prisma/client';
import {UpdateUploadDto} from './dto/update-upload.dto';
import {PrismaService} from "../prisma/prisma.service";
import {join} from 'path';
import * as fs from "fs";
import {createReadStream} from "fs";
import {UploadEntity} from "./entities/upload.entity";
import {User_uploadEntity} from "./entities/user_upload.entity";
import {isImage} from "../util";

const sharp = require('sharp');

@Injectable()
export class UploadService {
    constructor(private prismaService: PrismaService) {
    }

    async create(createUploadDto: Prisma.uploaded_fileUncheckedCreateInput, upload_data: User_uploadEntity) {
        upload_data = {
            user_id: +upload_data.user_id,
            entity_id: +upload_data.entity_id,
            entity: upload_data.entity,
            tag: upload_data.tag
        }
        createUploadDto.nameMini = createUploadDto.filename
        if (isImage(createUploadDto.mimetype)) {
            const file = fs.readFileSync(createUploadDto.path)
            sharp(file).resize(64, 64).toFile(createUploadDto.destination + "/mini_" + createUploadDto.filename);
            createUploadDto.nameMini = "mini_" + createUploadDto.filename
        }
        if (upload_data.tag === 'avatar') {
            let query = {
                tag: 'avatar',
                entity: 'user',
                entity_id: upload_data.entity_id
            }
            await this.deleteFromStorage(query)
            await this.prismaService.uploaded_file.findMany({
                where: {
                    tag: 'avatar',
                    entity: 'user',
                    entity_id: upload_data.entity_id
                }
            })
            await this.prismaService.uploaded_file.deleteMany({ where: {
                tag: 'avatar',
                entity_id: upload_data.entity_id
            }})
        }
        return this.prismaService.uploaded_file.create({data: {...createUploadDto, ...upload_data}})
    }

    async createMany(files: UploadEntity[], upload_data: User_uploadEntity) {
        let createdFiles = []
        for (const index of Object.keys(files)) {
            let file = await this.create(files[index], upload_data)
            createdFiles.push(file)
        }
        return createdFiles
    }

    findAll(query: object) {
        return this.prismaService.uploaded_file.findMany({where: {...query['where']}});
    }

    findOne(id: number) {
        return this.prismaService.uploaded_file.findUnique({where: {id}});
    }

    update(id: number, updateUploadDto: UpdateUploadDto) {
        return this.prismaService.uploaded_file.update({data: updateUploadDto, where: {id}});
    }

    async removeMany(ids: number[]) {
      let query = {id: {in: ids}}
        await this.deleteFromStorage(query)
        return this.prismaService.uploaded_file.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        })
    }

    async remove(id: number) {
        await this.deleteFromStorage({where: {id}})
        return this.prismaService.uploaded_file.delete({where: {id}});
    }

    async getFileByName(fileName: string) {
        let file = await this.prismaService.uploaded_file.findUnique({where: {filename: fileName}})
        if (!file) {
            file = await this.prismaService.uploaded_file.findUnique({where: {nameMini: fileName}})
            return createReadStream(join(file.destination+'/'+file.nameMini))
        }
        return createReadStream(join(file.path))
    }

    async deleteFromStorage(query) {
        await this.prismaService.uploaded_file.findMany({
            where: query
        }).then(files => {
            files.forEach(file => {
                if (isImage(file.mimetype)) {
                    fs.unlinkSync(file.path)
                }
                fs.unlinkSync(file.destination+'/'+file.nameMini)
            })
        })
    }
}
