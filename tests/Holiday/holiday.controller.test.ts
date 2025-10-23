// tests/Holiday/holiday.controller.test.ts
import { HolidayController } from "../../src/controllers/HolidayController";
import { Holiday } from "../../src/entities";
import { HolidayService } from "../../src/services/HolidayService";
import { Request, Response } from "express";

describe("HolidayController", () => {
  let service: jest.Mocked<HolidayService>;
  let controller: HolidayController;
  let res: Partial<Response>;

  beforeEach(() => {
    service = {
      getAllHolidays: jest.fn(),
      getHolidayByDate: jest.fn(),
      createHoliday: jest.fn(),
      updateHoliday: jest.fn(),
      deleteHoliday: jest.fn(),
    } as unknown as jest.Mocked<HolidayService>;

    controller = new HolidayController(service);

    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  test("getAll llama servicio y responde", async () => {
    const holidays: Holiday[] = [
      { id: "1", date: new Date("2025-01-01"), description: "Año nuevo" },
      { id: "2", date: new Date("2025-12-25"), description: "Navidad" },
    ];
    service.getAllHolidays.mockResolvedValue(holidays);
    await controller.getAll({} as Request, res as Response, () => {});
    expect(service.getAllHolidays).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(holidays);
  });

  test("getByDate responde con holiday", async () => {
    const req = { params: { date: "2025-12-25" } } as unknown as Request;
    const holiday = { description: "Navidad" };
    service.getHolidayByDate.mockResolvedValue(holiday as any);
    await controller.getByDate(req, res as Response, () => {});
    expect(service.getHolidayByDate).toHaveBeenCalledWith("2025-12-25");
    expect(res.json).toHaveBeenCalledWith(holiday);
  });

  test("create responde con 201 y holiday creado", async () => {
    const req = {
      body: { date: "2025-12-25", description: "Navidad" },
    } as Request;
    const created = { description: "Navidad" };
    service.createHoliday.mockResolvedValue(created as any);
    await controller.create(req, res as Response, () => {});
    expect(service.createHoliday).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });

  test("update responde con holiday actualizado", async () => {
    const req = {
      params: { date: "2025-12-25" },
      body: { description: "Nueva" },
    } as unknown as Request;
    const updated = { description: "Nueva" };
    service.updateHoliday.mockResolvedValue(updated as any);
    await controller.update(req, res as Response, () => {});
    expect(service.updateHoliday).toHaveBeenCalledWith("2025-12-25", req.body);
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  test("delete responde con 204", async () => {
    const req = { params: { date: "2025-12-25" } } as unknown as Request;
    service.deleteHoliday.mockResolvedValue({} as any);
    await controller.delete(req, res as Response, () => {});
    expect(service.deleteHoliday).toHaveBeenCalledWith("2025-12-25");
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
