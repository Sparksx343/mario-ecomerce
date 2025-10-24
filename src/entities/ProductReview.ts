import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { ModelVariant } from "./index";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class ProductReview extends BaseEntity {
  @ManyToOne(() => ModelVariant)
  modelVariant!: ModelVariant;

  @Property()
  rating!: number;

  @Property()
  comment!: string;
}
