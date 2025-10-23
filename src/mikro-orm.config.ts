import { defineConfig } from "@mikro-orm/postgresql";
import {
  Cron,
  CronLog,
  Attribute,
  AttributeValue,
  Brand,
  Category,
  Model,
  Product,
  Variant,
  VariantAttribute,
} from "./entities/index";
import { DB_CONFIG } from "./config/constants";

export default defineConfig({
  dbName: DB_CONFIG.dbName,
  user: DB_CONFIG.user,
  password: DB_CONFIG.password,
  host: DB_CONFIG.host,
  port: DB_CONFIG.port,
  entities: [
    Cron,
    CronLog,
    Attribute,
    AttributeValue,
    Brand,
    Category,
    Model,
    Product,
    Variant,
    VariantAttribute,
  ],
  migrations: {
    pathTs: "./src/migrations",
    path: "./dist/migrations",
  },
  seeder: {
    pathTs: "./src/seeders",
    path: "./dist/seeders",
    defaultSeeder: "UserSeeder",
    glob: "!(*.d).{js,ts}",
    emit: "ts",
    fileName: (className: string) => className,
  },
  timezone: "-06:00",
  pool: { min: 1, max: 10 },
  forceEntityConstructor: true,
  debug: DB_CONFIG.debug,
});
