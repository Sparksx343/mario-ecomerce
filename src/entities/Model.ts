import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { Product } from "./index";

@Entity()
export class Model extends BaseEntity {
  @Property({ unique: true })
  name!: string;

  @ManyToOne(() => Product)
  product!: Product;
}
