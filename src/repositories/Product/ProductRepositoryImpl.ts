import { EntityManager } from "@mikro-orm/core";
import { Product } from "../../entities";
import { CreateProductDto, UpdateProductDto } from "../../types/product.types";
import { IProductRepository } from "./ProductRepository";

export class ModelRepositoryImpl implements IProductRepository {
  constructor(private readonly em: EntityManager) {}

  async findAll(): Promise<Product[]> {
    return this.em.find(Product, {});
  }

  async findById(id: string): Promise<Product | null> {
    return this.em.findOne(Product, { id });
  }

  async create(data: CreateProductDto): Promise<Product> {
    const model = this.em.create(Product, {
      name: data.name,
      brand: data.brand,
      category: data.category,
      imageUrl: data.imageUrl,
    });
    await this.em.persistAndFlush(model);
    return model;
  }

  async update(product: Product, data: UpdateProductDto): Promise<Product> {
    const updatedBank = this.em.assign(product, data);
    await this.em.flush();
    return updatedBank;
  }

  async delete(id: string): Promise<Product | null> {
    const product = await this.findById(id);
    if (product && product.deletedAt == null) {
      product.deletedAt = new Date();
      await this.em.flush();
      return product;
    }
    return null;
  }
}
