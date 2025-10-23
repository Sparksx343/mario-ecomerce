import { IBrandRepository } from "../repositories/Brand/BrandRepository";
import { CreateBrandDto, UpdateBrandDto } from "../types/brand.types";
import { Brand } from "../entities/Brand";
import { NotFoundError } from "../utils/errors";

export class BrandService {
  constructor(private readonly brandRepository: IBrandRepository) {}

  async getAll(): Promise<Brand[]> {
    return this.brandRepository.findAll();
  }

  async getById(id: string): Promise<Brand> {
    const brand = await this.brandRepository.findById(id);
    if (!brand) throw new NotFoundError(`El banco con ID ${id} no encontrado`);
    return brand;
  }

  async create(data: CreateBrandDto): Promise<Brand> {
    return this.brandRepository.create(data);
  }

  async update(id: string, data: UpdateBrandDto): Promise<Brand> {
    const brand = await this.brandRepository.findById(id);
    if (!brand) throw new NotFoundError(`El banco con ID ${id} no encontrado`);
    return this.brandRepository.update(brand, data);
  }

  async delete(id: string): Promise<Brand> {
    const brand = await this.brandRepository.delete(id);
    if (!brand) throw new NotFoundError(`El banco con ID ${id} no encontrado`);
    return brand;
  }
}
