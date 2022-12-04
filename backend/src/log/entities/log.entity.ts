import {BaseEntity} from "../../util/entities/base.entity";

export class LogEntity extends BaseEntity {
  entity: string
  entity_id: number
  data: string
  action: string
}
