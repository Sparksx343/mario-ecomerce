export interface CreateModelVariantReviewDto {
  modelVariant: string;
  rating: number;
  comment: string;
}
export type UpdateModelVariantReviewDto = Partial<CreateModelVariantReviewDto>;
