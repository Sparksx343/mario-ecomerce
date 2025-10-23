import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { Model, AttributeValue } from "./index";

@Entity()
export class VariantAttributeValue extends BaseEntity {
  @ManyToOne(() => Model)
  model!: Model;

  @ManyToOne(() => AttributeValue)
  attributeValue!: AttributeValue;
}
