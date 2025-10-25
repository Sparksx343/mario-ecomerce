import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { Category, Brand } from "./index";

@Entity()
export class Product extends BaseEntity {
  @Property({ unique: true })
  name!: string;

  @ManyToOne(() => Brand)
  brand!: Brand;

  @ManyToOne(() => Category)
  category!: Category;

  @Property({ nullable: true })
  imageUrl?: string;
}
