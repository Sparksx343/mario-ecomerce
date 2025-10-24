import { Entity, ManyToOne } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { AttributeValue, ModelVariant } from "./index";

@Entity()
export class ModelVariantAttributeValue extends BaseEntity {
  @ManyToOne(() => ModelVariant)
  variant!: ModelVariant;

  @ManyToOne(() => AttributeValue)
  attributeValue!: AttributeValue;
}
