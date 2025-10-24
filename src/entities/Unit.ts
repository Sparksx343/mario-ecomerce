import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Unit extends BaseEntity {
  @Property()
  name!: string; // e.g., "Gigabyte"

  @Property()
  symbol!: string; // e.g., "GB"
}
