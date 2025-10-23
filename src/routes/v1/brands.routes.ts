import { Router, Request, Response, NextFunction } from "express";
import { BrandController } from "../../controllers/BrandController";
import { BrandRepositoryImpl } from "../../repositories/Brand/BrandRepositoryImpl";
import { BrandService } from "../../services/BrandService";
import { RequestContext } from "@mikro-orm/core";
import { orm } from "../../config/database";
import { SqlEntityManager } from "@mikro-orm/postgresql";
import { validate } from "../../middlewares/validation.middleware";
import {
  brandCreateSchema,
  brandUpdateSchema,
} from "../../validators/brand.validator";

const router = Router();

router.use(async (req: Request, res: Response, next: NextFunction) => {
  const em = (await orm()).em.fork() as SqlEntityManager;
  RequestContext.create(em, () => {
    // Guardamos el EntityManager en el request para usarlo después
    (req as any).em = em;
    next();
  });
});

// Middleware para inyectar el controlador por request
function withController(
  handler: (
    controller: BrandController,
    req: Request,
    res: Response,
    next: NextFunction
  ) => any
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const em = (req as any).em as SqlEntityManager;
    const repository = new BrandRepositoryImpl(em);
    const service = new BrandService(repository);
    const controller = new BrandController(service);
    return handler(controller, req, res, next);
  };
}

router.get(
  "/",
  withController((ctrl, req, res, next) => ctrl.getAll(req, res, next))
);
router.get(
  "/:id",
  withController((ctrl, req, res, next) => ctrl.getById(req, res, next))
);
router.post(
  "/",
  validate(brandCreateSchema),
  withController((ctrl, req, res, next) => ctrl.create(req, res, next))
);
router.put(
  "/:id",
  validate(brandUpdateSchema),
  withController((ctrl, req, res, next) => ctrl.update(req, res, next))
);
router.delete(
  "/:id",
  withController((ctrl, req, res, next) => ctrl.delete(req, res, next))
);

export default router;
