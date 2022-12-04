import {ConstraintsEntity} from "./constraints.entity";

export class FilterEntity {
  operator: string
  constraints: ConstraintsEntity[]
}