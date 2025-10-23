import { Seeder } from "@mikro-orm/seeder";
import { EntityManager } from "@mikro-orm/core";
import { User } from "../entities/User";
import { hasher } from "../utils/encripter";
import { nowInMexicoCity } from "../utils/dateTime";

export class UserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const date = nowInMexicoCity();

    em.upsert(User, {
      id: "1",
      username: "System",
      password: hasher("rycdlcdev"),
      createdAt: date,
      updatedAt: date,
    });
  }
}
