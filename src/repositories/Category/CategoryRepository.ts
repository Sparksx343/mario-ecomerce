import { Category } from "../../entities/index";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../../types/category.types";

export interface ICategoryRepository {
  findAll(): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
  create(data: CreateCategoryDto): Promise<Category>;
  update(holiday: Category, data: UpdateCategoryDto): Promise<Category>;
  delete(id: string): Promise<Category | null>;
}
