import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { Product, ModelVariant } from "./index";

@Entity()
export class Model extends BaseEntity {
  @Property({ unique: true })
  name!: string;

  @ManyToOne(() => Product)
  product!: Product;

  @OneToMany(() => ModelVariant, (variant) => variant.model)
  variants = new Collection<ModelVariant>(this);
}
