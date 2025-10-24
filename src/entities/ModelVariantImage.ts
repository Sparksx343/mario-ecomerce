import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { ModelVariant } from "./index";

@Entity()
export class ModelVariantImage extends BaseEntity {
  @Property()
  imageUrl!: string; // URL of the image

  @Property()
  imageType!: string; // e.g., "main", "gallery"

  @ManyToOne(() => ModelVariant)
  modelVariant!: ModelVariant;
}
