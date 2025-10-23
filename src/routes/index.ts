import { Router } from "express";
import v1Routes from "./v1";

const router = Router();
// TODO: Agregar el prefijo /attendance/v1
router.use("/v1", v1Routes);

export default router;
