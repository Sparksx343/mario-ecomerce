import { orm } from "../config/database";
import { createEmployeeFactory } from "../factories/employee.factory";
import { createEmployeeShiftFactory } from "../factories/employeeShift.factory";
import { ShiftRepositoryImpl } from "../repositories/Shift/ShiftRepositoryImpl";
import { logger } from "../utils/logger";

const run = async () => {
  const count = parseInt(process.argv[2] || "1", 10);
  const ormInstance = await orm();

  await ormInstance.em.transactional(async (em) => {
    const createEmployee = createEmployeeFactory(em);
    const createEmployeeShift = createEmployeeShiftFactory(em);
    const shiftRepo = new ShiftRepositoryImpl(em);

    const employees = await Promise.all(
      Array.from({ length: count }).map(() => createEmployee())
    );

    logger.info(`${employees.length} empleados creados`);

    const shift = await shiftRepo.findAll();

    if (shift.length !== 0) {
      for (const employee of employees) {
        const randomIndex = Math.floor(Math.random() * shift.length);
        const randomShift = shift[randomIndex] || shift[0];
        if (randomShift && randomShift.id) {
          await createEmployeeShift(employee.id, randomShift.id);
        } else {
          logger.error(
            `Could not assign a shift for employee: ${employee.id} - randomShift or its ID is invalid.`
          );
        }
      }
    } else {
      throw new Error("Sin shiftId");
    }
  });

  await ormInstance.close();
};

run().catch((err) => {
  logger.error("Error ejecutando factory:", err);
  process.exit(1);
});
