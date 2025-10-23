import express from "express";
import supertest, { SuperTest, Test } from "supertest";
import { MikroORM } from "@mikro-orm/sqlite";
import { EntityManager } from "@mikro-orm/core";
import { Holiday } from "../../src/entities/Holiday";
import { HolidayRepositoryImpl } from "../../src/repositories/Holiday/HolidayRepositoryImpl";
import { HolidayService } from "../../src/services/HolidayService";
import { HolidayController } from "../../src/controllers/HolidayController";

describe("HolidayController Integration", () => {
  let orm: MikroORM;
  let em: EntityManager;
  let request: SuperTest<Test>;

  beforeAll(async () => {
    orm = await MikroORM.init({
      entities: [Holiday],
      dbName: ":memory:",
    });

    await orm.getSchemaGenerator().createSchema();
    em = orm.em.fork();

    const holidayRepo = new HolidayRepositoryImpl(em);
    const holidayService = new HolidayService(holidayRepo);
    const holidayController = new HolidayController(holidayService);

    const app = express();
    app.use(express.json());

    // Definimos rutas reales simulando Express
    app.get("/holidays", holidayController.getAll);
    app.get("/holidays/:date", holidayController.getByDate);
    app.post("/holidays", holidayController.create);
    app.put("/holidays/:date", holidayController.update);
    app.delete("/holidays/:date", holidayController.delete);

    request = supertest(app) as unknown as SuperTest<Test>;
  });

  afterAll(async () => {
    await orm.close(true);
  });

  test("POST /holidays → crea un holiday", async () => {
    const res = await request.post("/holidays").send({
      date: "2025-12-25",
      description: "Navidad",
    });

    expect(res.status).toBe(201);
    expect(res.body.description).toBe("Navidad");
  });

  test("GET /holidays → lista holidays", async () => {
    const res = await request.get("/holidays");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  test("GET /holidays/:date → obtiene un holiday por fecha", async () => {
    const res = await request.get("/holidays/2025-12-25");
    expect(res.status).toBe(200);
    expect(res.body.description).toBe("Navidad");
  });

  test("PUT /holidays/:date → actualiza un holiday", async () => {
    const res = await request.put("/holidays/2025-12-25").send({
      description: "Navidad actualizada",
    });
    expect(res.status).toBe(200);
    expect(res.body.description).toBe("Navidad actualizada");
  });

  test("DELETE /holidays/:date → elimina un holiday", async () => {
    const res = await request.delete("/holidays/2025-12-25");
    expect(res.status).toBe(204);
  });
});
