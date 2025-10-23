import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { Attribute } from "./Attribute";

@Entity()
export class AttributeValue extends BaseEntity {
  @ManyToOne(() => Attribute)
  attribute!: Attribute;

  @Property({ unique: true })
  value!: string;
}
