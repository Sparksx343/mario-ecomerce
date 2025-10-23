// tests/Holiday/holiday.service.test.ts
import { HolidayService } from "../../src/services/HolidayService";
import { NotFoundError } from "../../src/utils/errors";

describe("HolidayService", () => {
  let service: HolidayService;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findByDate: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    service = new HolidayService(mockRepo);
  });

  test("getAllHolidays llama al repo", async () => {
    mockRepo.findAll.mockResolvedValue(["holiday1", "holiday2"]);
    const holidays = await service.getAllHolidays();
    expect(holidays).toEqual(["holiday1", "holiday2"]);
    expect(mockRepo.findAll).toHaveBeenCalled();
  });

  test("getHolidayByDate lanza error si no existe", async () => {
    mockRepo.findByDate.mockResolvedValue(null);
    await expect(service.getHolidayByDate("2025-12-25")).rejects.toThrow(
      NotFoundError
    );
  });

  test("createHoliday llama al repo", async () => {
    mockRepo.create.mockResolvedValue("nuevoHoliday");
    const res = await service.createHoliday({
      date: "2025-12-25",
      description: "X",
    });
    expect(res).toBe("nuevoHoliday");
    expect(mockRepo.create).toHaveBeenCalledWith({
      date: "2025-12-25",
      description: "X",
    });
  });

  test("updateHoliday lanza error si no existe", async () => {
    mockRepo.findByDate.mockResolvedValue(null);
    await expect(
      service.updateHoliday("2025-12-25", { description: "Y" })
    ).rejects.toThrow(NotFoundError);
  });

  test("updateHoliday actualiza correctamente", async () => {
    const holiday = { description: "X" };
    mockRepo.findByDate.mockResolvedValue(holiday);
    mockRepo.update.mockResolvedValue({ description: "Y" });

    const res = await service.updateHoliday("2025-12-25", { description: "Y" });
    expect(res.description).toBe("Y");
    expect(mockRepo.update).toHaveBeenCalledWith(holiday, { description: "Y" });
  });

  test("deleteHoliday lanza error si no existe", async () => {
    mockRepo.delete.mockResolvedValue(null);
    await expect(service.deleteHoliday("2025-12-25")).rejects.toThrow(
      NotFoundError
    );
  });

  test("deleteHoliday elimina correctamente", async () => {
    mockRepo.delete.mockResolvedValue({ description: "X" });
    const res = await service.deleteHoliday("2025-12-25");
    expect(res.description).toBe("X");
    expect(mockRepo.delete).toHaveBeenCalledWith("2025-12-25");
  });
});
