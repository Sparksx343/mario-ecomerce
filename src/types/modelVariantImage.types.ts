export interface CreateModelVariantImageDto {
  imageUrl: string;
  imageType: string;
  modelVariant: string;
}
export type UpdateModelVariantImageDto = Partial<CreateModelVariantImageDto>;
