export interface CreateModelVariantAttributeValueDto {
  variant: string;
  attributeValue: string;
}
export type UpdateModelVariantAttributeValueDto =
  Partial<CreateModelVariantAttributeValueDto>;
