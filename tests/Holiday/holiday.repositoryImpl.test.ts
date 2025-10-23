// tests/Holiday/holiday.repositoryImpl.test.ts
import { MikroORM } from "@mikro-orm/sqlite";
import { EntityManager } from "@mikro-orm/core";
import { HolidayRepositoryImpl } from "../../src/repositories/Holiday/HolidayRepositoryImpl";
import { Holiday } from "../../src/entities/Holiday";

describe("HolidayRepositoryImpl", () => {
  let orm: MikroORM;
  let em: EntityManager;
  let repo: HolidayRepositoryImpl;

  beforeAll(async () => {
    orm = await MikroORM.init({
      entities: [Holiday],
      dbName: ":memory:",
    });
    await orm.getSchemaGenerator().createSchema();
    em = orm.em.fork();
    repo = new HolidayRepositoryImpl(em);
  });

  afterAll(async () => {
    await orm.close(true);
  });

  test("create y findByDate funcionan correctamente", async () => {
    const dateStr = "2025-12-25";

    const created = await repo.create({
      date: dateStr,
      description: "Navidad",
    });

    expect(created.description).toBe("Navidad");
    expect(created.date.toISOString().startsWith("2025-12-25")).toBe(true);

    const found = await repo.findByDate(dateStr);
    expect(found).not.toBeNull();
    expect(found!.description).toBe("Navidad");
  });

  test("update actualiza un registro", async () => {
    const holiday = await repo.findByDate("2025-12-25");
    expect(holiday).not.toBeNull();

    const updated = await repo.update(holiday!, {
      description: "Navidad Actualizada",
    });
    expect(updated.description).toBe("Navidad Actualizada");
  });

  test("delete marca como eliminado", async () => {
    const deleted = await repo.delete("2025-12-25");
    expect(deleted).not.toBeNull();
    expect(deleted!.deletedAt).not.toBeNull();

    const stillThere = await repo.findByDate("2025-12-25");
    expect(stillThere).not.toBeNull();
  });
});
