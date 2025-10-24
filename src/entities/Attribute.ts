import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { Unit } from "./index";

@Entity()
export class Attribute extends BaseEntity {
  @Property({ unique: true })
  name!: string;

  @ManyToOne(() => Unit, { nullable: true })
  unit?: Unit;
}
