export interface CreateAttributeValueDto {
  attribute: string;
  value: string;
}
export type UpdateAttributeValueDto = Partial<CreateAttributeValueDto>;
