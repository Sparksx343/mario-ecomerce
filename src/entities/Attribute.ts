import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Attribute extends BaseEntity {
  @Property({ unique: true })
  name!: string;
}
