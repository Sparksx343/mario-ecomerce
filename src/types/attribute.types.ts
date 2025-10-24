export interface CreateAttributeDto {
  name: string;
}
export type UpdateAttributeDto = Partial<CreateAttributeDto>;
