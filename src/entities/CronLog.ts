import { Entity, Enum, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 } from "uuid";
import { Cron } from "./Cron";

export enum CRON_EXECUTION_STATUS {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

@Entity()
export class CronLog {
  @PrimaryKey()
  id: string = v4();

  @ManyToOne()
  task!: Cron;

  @Enum(() => CRON_EXECUTION_STATUS)
  status!: CRON_EXECUTION_STATUS;

  @Property()
  attempt!: number;

  @Property()
  executedAt: Date = new Date();

  @Property({ type: "jsonb", nullable: true })
  errorMessage?: Record<string, any>;
}
