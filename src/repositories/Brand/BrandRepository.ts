import { Brand } from "../../entities/index";
import { CreateBrandDto, UpdateBrandDto } from "../../types/brand.types";

export interface IBrandRepository {
  findAll(): Promise<Brand[]>;
  findById(id: string): Promise<Brand | null>;
  create(data: CreateBrandDto): Promise<Brand>;
  update(holiday: Brand, data: UpdateBrandDto): Promise<Brand>;
  delete(id: string): Promise<Brand | null>;
}
