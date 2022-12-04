import { PartialType } from '@nestjs/mapped-types';
import {CreatePermissionsDto} from "./create-permission.dto";

export class UpdatePermissionsDto extends PartialType(CreatePermissionsDto) {}
