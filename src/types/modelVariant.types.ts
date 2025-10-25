export interface CreateModelVariantDto {
  sku: string;
  price: number;
  stock: number;
  model: string;
  averageRating: number;
}
export type UpdateModelVariantDto = Partial<CreateModelVariantDto>;
