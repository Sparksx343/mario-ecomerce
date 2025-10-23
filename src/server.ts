/* eslint-disable @typescript-eslint/no-unused-vars */
import app from "./app";
import { orm } from "./config/database";
import { PORT } from "./config/constants";
import { logger } from "./utils/logger";
import https from "https";
import fs from "fs";
import path from "path";

const start = async () => {
  try {
    // Initialize ORM
    const ormInstance = await orm();
    logger.info("Database connection established");

    // Initialize cron jobs (uncomment when needed)
    //const cronJobService = new CronJobService(ormInstance);
    //await seedCronTasks(ormInstance, cronJobService);
    //cronJobService.initializeCronJobs();

    // Carga los Certificados para el SSL
    const certPath = path.join(__dirname, "cert");

    const httpsOptions = {
      key: fs.readFileSync(path.join(certPath, "david.local.dev-key.pem")),
      cert: fs.readFileSync(path.join(certPath, "david.local.dev.pem")),
    };

    // Start HTTP server
    /*  app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}/api/v1/`);
    }); */

    // Start HTTPS Server
    https.createServer(httpsOptions, app).listen(PORT, () => {
      logger.info(`HTTPS server running at https://localhost:${PORT}/api/v1/`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      logger.error("Shutting down gracefully...");
      try {
        await ormInstance.close();
        process.exit(0);
      } catch (error) {
        logger.error("Error during shutdown:", error);
        process.exit(1);
      }
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    logger.error("Error starting server:", error);
    process.exit(1);
  }
};

start();
