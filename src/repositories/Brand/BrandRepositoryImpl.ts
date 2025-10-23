import { EntityManager } from "@mikro-orm/core";
import { Brand } from "../../entities";
import { CreateBrandDto, UpdateBrandDto } from "../../types/brand.types";
import { IBrandRepository } from "./BrandRepository";

export class BrandRepositoryImpl implements IBrandRepository {
  constructor(private readonly em: EntityManager) {}

  async findAll(): Promise<Brand[]> {
    return this.em.find(Brand, {});
  }

  async findById(id: string): Promise<Brand | null> {
    return this.em.findOne(Brand, { id });
  }

  async create(data: CreateBrandDto): Promise<Brand> {
    const brand = this.em.create(Brand, {
      name: data.name,
    });
    await this.em.persistAndFlush(brand);
    return brand;
  }

  async update(brand: Brand, data: UpdateBrandDto): Promise<Brand> {
    const updatedBank = this.em.assign(brand, data);
    await this.em.flush();
    return updatedBank;
  }

  async delete(id: string): Promise<Brand | null> {
    const brand = await this.findById(id);
    if (brand && brand.deletedAt == null) {
      brand.deletedAt = new Date();
      await this.em.flush();
      return brand;
    }
    return null;
  }
}
