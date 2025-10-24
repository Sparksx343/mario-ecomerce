import { EntityManager } from "@mikro-orm/core";
import { Category } from "../../entities";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../../types/category.types";
import { ICategoryRepository } from "./CategoryRepository";

export class CategoryRepositoryImpl implements ICategoryRepository {
  constructor(private readonly em: EntityManager) {}

  async findAll(): Promise<Category[]> {
    return this.em.find(Category, {});
  }

  async findById(id: string): Promise<Category | null> {
    return this.em.findOne(Category, { id });
  }

  async create(data: CreateCategoryDto): Promise<Category> {
    const category = this.em.create(Category, {
      name: data.name,
    });
    await this.em.persistAndFlush(category);
    return category;
  }

  async update(category: Category, data: UpdateCategoryDto): Promise<Category> {
    const updatedBank = this.em.assign(category, data);
    await this.em.flush();
    return updatedBank;
  }

  async delete(id: string): Promise<Category | null> {
    const category = await this.findById(id);
    if (category && category.deletedAt == null) {
      category.deletedAt = new Date();
      await this.em.flush();
      return category;
    }
    return null;
  }
}
