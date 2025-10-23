import { orm } from "../config/database";
import { createShiftFactory } from "../factories/shift.factory";
import { createDailyShiftFactory } from "../factories/dailyShift.factory";
import { createWorkPeriodFactory } from "../factories/workPeriod.factory";
import { logger } from "../utils/logger";

const run = async () => {
  const count = parseInt(process.argv[2] || "1", 10);
  const ormInstance = await orm();

  await ormInstance.em.transactional(async (em) => {
    const createShift = createShiftFactory(em);
    const createDailyShift = createDailyShiftFactory(em);
    const createWorkPeriod = createWorkPeriodFactory(em);

    const shifts = await Promise.all(
      Array.from({ length: count }).map(() => createShift())
    );

    logger.info(`${shifts.length} horarios creados`);

    for (const shift of shifts) {
      const dailyshifts = await createDailyShift(shift.id);
      for (const dailyshift of dailyshifts) {
        await createWorkPeriod(dailyshift.id);
      }
    }
  });

  await ormInstance.close();
};

run().catch((err) => {
  logger.error("Error ejecutando factory:", err);
  process.exit(1);
});
