import { z } from "zod";

export const brandCreateSchema = z.object({
  name: z.string().min(1, "El nommbre del banco es requerido"),
});

export const brandUpdateSchema = brandCreateSchema.partial();
