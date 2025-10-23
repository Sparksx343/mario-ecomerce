import { Request, Response } from "express";
import { BrandService } from "../services/BrandService";
import { asyncHandler, ValidationError } from "../utils/errors";

export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  getAll = asyncHandler(async (_req: Request, res: Response) => {
    const brands = await this.brandService.getAll();
    res.json(brands);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) throw new ValidationError("No se proporcionó un ID");
    const brand = await this.brandService.getById(id);
    res.json(brand);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const brand = await this.brandService.create(data);
    res.status(201).json(brand);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) throw new ValidationError("No se proporcionó un ID");
    const newData = req.body;
    const updatedBank = await this.brandService.update(id, newData);
    res.json(updatedBank);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) throw new ValidationError("No se proporcionó un ID");
    await this.brandService.delete(id);
    return res.status(204).send();
  });
}
