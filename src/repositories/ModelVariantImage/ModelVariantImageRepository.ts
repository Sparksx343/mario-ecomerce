import { ModelVariantImage } from "../../entities/index";
import {
  CreateModelVariantImageDto,
  UpdateModelVariantImageDto,
} from "../../types/modelVariantImage.types";

export interface IModelVariantImageRepository {
  findAll(): Promise<ModelVariantImage[]>;
  findById(id: string): Promise<ModelVariantImage | null>;
  create(data: CreateModelVariantImageDto): Promise<ModelVariantImage>;
  update(
    holiday: ModelVariantImage,
    data: UpdateModelVariantImageDto
  ): Promise<ModelVariantImage>;
  delete(id: string): Promise<ModelVariantImage | null>;
}
