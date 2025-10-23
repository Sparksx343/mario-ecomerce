import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 } from "uuid";

@Entity()
export class Cron {
  @PrimaryKey()
  id: string = v4();

  @Property({ unique: true })
  taskName!: string;

  @Property({ nullable: true })
  description?: string;
}
