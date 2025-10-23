import { orm } from "../config/database";
import { Employee } from "../entities";
import { createVacationFactory } from "../factories/vacation.factory";
import { EmployeeRepositoryImpl } from "../repositories/Employee/EmployeeRepositoryImpl";
import { arrayGetRandomElements } from "../utils/arrays";
import { logger } from "../utils/logger";

const run = async () => {
  const count = parseInt(process.argv[2] || "1", 10);
  const ormInstance = await orm();

  await ormInstance.em.transactional(async (em) => {
    const createVacation = createVacationFactory(em);
    const employeeRepo = new EmployeeRepositoryImpl(em);

    const employees = await employeeRepo.findAll();

    const employeesSelected: Employee[] = arrayGetRandomElements(
      employees,
      count
    );

    const vacations = await Promise.all(
      employeesSelected.map((em) => createVacation(em.id, "1"))
    );
    logger.info(`${vacations.length} Vacaciones creadas`);
  });

  await ormInstance.close();
};

run().catch((err) => {
  logger.error("Error ejecutando factory:", err);
  process.exit(1);
});
