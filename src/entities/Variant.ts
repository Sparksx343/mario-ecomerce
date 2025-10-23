import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { Model } from "./index";

@Entity()
export class Variant extends BaseEntity {
  @Property({ unique: true })
  sku!: string;

  @Property()
  price!: string;

  @Property()
  stock!: number;

  @ManyToOne(() => Model)
  model!: Model;
}
