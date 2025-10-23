import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { UniqueConstraintViolationException } from "@mikro-orm/core";
import { logger } from "../utils/logger";
import { HttpError } from "../utils/errors";
import { NODE_ENV } from "../config/constants";

export const errorMiddleware: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Evitar que el error se propague si ya se envió la respuesta
  if (res.headersSent) {
    return next(err);
  }
  // Log detallado del error
  logger.error({
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    body: req.body,
    params: req.params,
    query: req.query,
  });

  // Error de validación de Zod
  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Error de validación",
      errors: err.errors.map((error) => ({
        field: error.path.join("."),
        message: error.message,
        code: error.code,
      })),
    });
    return;
  }

  // Error de constraint único de MikroORM
  if (err instanceof UniqueConstraintViolationException) {
    res.status(409).json({
      message: "Este recurso ya existe",
      error: "DUPLICATE_RESOURCE",
    });
    return;
  }

  // Errores HTTP personalizados
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      message: err.message,
      error: err.name,
    });
    return;
  }

  // Error genérico del servidor
  res.status(500).json({
    message: "Error interno del servidor",
    error: NODE_ENV === "development" ? err.message : "INTERNAL_SERVER_ERROR",
  });
};
