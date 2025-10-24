import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { ModelVariant } from "./index";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Discount extends BaseEntity {
  @ManyToOne(() => ModelVariant)
  modelVariant!: ModelVariant;

  @Property()
  percentage!: number;

  @Property()
  directDiscount!: number;

  @Property()
  startDate!: Date;

  @Property()
  endDate!: Date;
}
