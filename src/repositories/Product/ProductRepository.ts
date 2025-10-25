import { Product } from "../../entities/index";
import { CreateProductDto, UpdateProductDto } from "../../types/product.types";

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(data: CreateProductDto): Promise<Product>;
  update(holiday: Product, data: UpdateProductDto): Promise<Product>;
  delete(id: string): Promise<Product | null>;
}
