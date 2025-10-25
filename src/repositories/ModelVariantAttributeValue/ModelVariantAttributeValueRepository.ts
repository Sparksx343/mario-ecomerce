import { ModelVariantAttributeValue } from "../../entities/index";
import {
  CreateModelVariantAttributeValueDto,
  UpdateModelVariantAttributeValueDto,
} from "../../types/modelVariantAttributeValue.types";

export interface IModelVariantAttributeValueRepository {
  findAll(): Promise<ModelVariantAttributeValue[]>;
  findById(id: string): Promise<ModelVariantAttributeValue | null>;
  create(
    data: CreateModelVariantAttributeValueDto
  ): Promise<ModelVariantAttributeValue>;
  update(
    holiday: ModelVariantAttributeValue,
    data: UpdateModelVariantAttributeValueDto
  ): Promise<ModelVariantAttributeValue>;
  delete(id: string): Promise<ModelVariantAttributeValue | null>;
}
