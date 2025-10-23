import { Request, Response, NextFunction } from "express";

type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next?: NextFunction
) => Promise<any>;

export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = "Recurso no encontrado") {
    super(message, 404);
  }
}

export class ValidationError extends HttpError {
  constructor(message: string = "Error de validación") {
    super(message, 400);
  }
}

export class ConflictError extends HttpError {
  constructor(message: string = "El recurso ya existe") {
    super(message, 409);
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string = "Solicitud incorrecta") {
    super(message, 400);
  }
}

export class NotAllowedRequestError extends HttpError {
  constructor(message: string = "Acción no permitida") {
    super(message, 403);
  }
}

export const asyncHandler = (fn: AsyncRouteHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
