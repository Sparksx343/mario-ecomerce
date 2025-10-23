import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Category extends BaseEntity {
  @Property({ unique: true })
  name!: string;

  @ManyToOne(() => Category, { nullable: true })
  parentCategory?: Category;
}
