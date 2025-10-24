import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { Model, ModelVariantAttributeValue } from "./index";

@Entity()
export class ModelVariant extends BaseEntity {
  @Property()
  sku!: string;

  @Property()
  price!: number;
  @Property()
  stock!: number;

  @ManyToOne(() => Model)
  model!: Model;

  @OneToMany(() => ModelVariantAttributeValue, (mva) => mva.variant)
  attributeValues = new Collection<ModelVariantAttributeValue>(this);
}
