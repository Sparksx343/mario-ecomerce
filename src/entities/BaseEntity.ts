import { Filter, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 } from "uuid";

@Filter({
  name: "softDelete",
  cond: () => ({ deletedAt: null }),
  default: true,
})
export abstract class BaseEntity {
  @PrimaryKey()
  id: string = v4();

  @Property()
  createdAt?: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt?: Date = new Date();

  @Property({ nullable: true })
  deletedAt?: Date;
}
