import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { Attribute, Unit } from "./index";

@Entity()
export class AttributeValue extends BaseEntity {
  @ManyToOne(() => Attribute)
  attribute!: Attribute;

  @Property()
  value!: string;

  @ManyToOne(() => Unit, { nullable: true })
  unit?: Unit;
}
