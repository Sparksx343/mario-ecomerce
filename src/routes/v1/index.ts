import { Router } from "express";

import { auth } from "../../middlewares/auth.middleware";
import { logger } from "../../utils/logger";

const router = Router();

// Rutas que son públicas
const publicRoutes = ["/check"];

router.use((req, res, next) => {
  if (publicRoutes.some((path) => req.path.startsWith(path))) {
    return next(); // salta el middleware de auth
  }
  logger.info(`Entrando al AuthMiddleware por ruta: ${req.path}`);
  return auth(req, res, next);
});

//router.use("/attendances", attendanceRoutes);

export default router;
