// middlewares/auth.ts
import { Request, Response, NextFunction } from "express";

// Para indicarle que vamos agregar createdById al type de Request
declare module "express-serve-static-core" {
  interface Request {
    requestMadeById?: string;
  }
}

export const auth = (req: Request, res: Response, next: NextFunction): void => {
  /* if (!req.cookies) {
    res.status(401).json({ message: "Unauthorized: No cookies present" });
    return;
  }
  const sessionCookie = req.cookies["session"];

  if (!sessionCookie) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const userId = verifySession(sessionCookie);

  if (!userId) {
    res.status(401).json({ message: "Invalid session" });
    return;
  } */

  req.requestMadeById = "1"; //userId;
  next();
};

/* function verifySession(cookie: string): string | null {
  return cookie === "valid-cookie" ? "user-123" : null;
} */
