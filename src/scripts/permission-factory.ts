import { orm } from "../config/database";
import { createPermissionFactory } from "../factories/permission.factory";
import { createPermissionTimeRangeFactory } from "../factories/permissionTimeRange.factory";
import { createPermissionShiftCompensationFactory } from "../factories/permissionShiftCompensation.factory";
import { EmployeeRepositoryImpl } from "../repositories/Employee/EmployeeRepositoryImpl";
import { logger } from "../utils/logger";
import { arrayGetRandomElements } from "../utils/arrays";
import { Employee } from "../entities";

const run = async () => {
  const count = parseInt(process.argv[2] || "1", 10);
  const ormInstance = await orm();

  await ormInstance.em.transactional(async (em) => {
    const createPermission = createPermissionFactory(em);
    const createPermissionTimeRange = createPermissionTimeRangeFactory(em);
    const createPermissionShiftMod =
      createPermissionShiftCompensationFactory(em);
    const employeeRepo = new EmployeeRepositoryImpl(em);

    const employees: Employee[] = await employeeRepo.findAll();

    const employeesSelected: Employee[] = arrayGetRandomElements(
      employees,
      count
    );

    const permissions = await Promise.all(
      employeesSelected.map((em) => createPermission(em.id, "1"))
    );
    logger.info(`${permissions.length} permisos creados`);

    const timeRanges = await Promise.all(
      permissions.map((permission) => createPermissionTimeRange(permission.id))
    );
    logger.info(`${timeRanges.length} timeRanges creados`);

    const shiftMods = await Promise.all(
      permissions.map(async (permission) => {
        const periodOrders = Math.floor(Math.random() * 2) + 1;
        const results = await Promise.all(
          Array.from({ length: periodOrders }).map((_, index) =>
            createPermissionShiftMod(permission.id, permission.date, {
              periodOrder: index + 1,
            })
          )
        );
        return results;
      })
    );

    logger.info(`${shiftMods.length} timeRanges creados`);
  });

  await ormInstance.close();
};

run().catch((err) => {
  logger.error("Error ejecutando factory:", err);
  process.exit(1);
});
