export interface CreateCategoryDto {
  name: string;
}
export type UpdateCategoryDto = Partial<CreateCategoryDto>;
