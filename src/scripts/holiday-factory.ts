import { orm } from "../config/database";
import { createAllMexicanHolidays } from "../factories/holiday.factory";
import { logger } from "../utils/logger";

const run = async () => {
  const ormInstance = await orm();

  await ormInstance.em.transactional(async (em) => {
    const holidays = await createAllMexicanHolidays(em);

    logger.info(`${holidays.length} Dias festivos creados`);
  });

  await ormInstance.close();
};

run().catch((err) => {
  logger.error("Error ejecutando factory:", err);
  process.exit(1);
});
