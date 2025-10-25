import { ModelVariant } from "../../entities/index";
import {
  CreateModelVariantDto,
  UpdateModelVariantDto,
} from "../../types/modelVariant.types";

export interface IModelVariantRepository {
  findAll(): Promise<ModelVariant[]>;
  findById(id: string): Promise<ModelVariant | null>;
  create(data: CreateModelVariantDto): Promise<ModelVariant>;
  update(
    holiday: ModelVariant,
    data: UpdateModelVariantDto
  ): Promise<ModelVariant>;
  delete(id: string): Promise<ModelVariant | null>;
}
