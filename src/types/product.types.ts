export interface CreateProductDto {
  name: string;
  brand: string;
  category: string;
  imageUrl?: string;
}
export type UpdateProductDto = Partial<CreateProductDto>;
