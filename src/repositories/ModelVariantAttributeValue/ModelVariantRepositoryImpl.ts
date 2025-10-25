import { EntityManager } from "@mikro-orm/core";
import { ModelVariantAttributeValue } from "../../entities";
import {
  CreateModelVariantAttributeValueDto,
  UpdateModelVariantAttributeValueDto,
} from "../../types/modelVariantAttributeValue.types";
import { IModelVariantAttributeValueRepository } from "./ModelVariantAttributeValueRepository";

export class ModelRepositoryImpl
  implements IModelVariantAttributeValueRepository
{
  constructor(private readonly em: EntityManager) {}

  async findAll(): Promise<ModelVariantAttributeValue[]> {
    return this.em.find(ModelVariantAttributeValue, {});
  }

  async findById(id: string): Promise<ModelVariantAttributeValue | null> {
    return this.em.findOne(ModelVariantAttributeValue, { id });
  }

  async create(
    data: CreateModelVariantAttributeValueDto
  ): Promise<ModelVariantAttributeValue> {
    const model = this.em.create(ModelVariantAttributeValue, {
      variant: data.variant,
      attributeValue: data.attributeValue,
    });
    await this.em.persistAndFlush(model);
    return model;
  }

  async update(
    modelVariant: ModelVariantAttributeValue,
    data: UpdateModelVariantAttributeValueDto
  ): Promise<ModelVariantAttributeValue> {
    const updatedBank = this.em.assign(modelVariant, data);
    await this.em.flush();
    return updatedBank;
  }

  async delete(id: string): Promise<ModelVariantAttributeValue | null> {
    const modelVariant = await this.findById(id);
    if (modelVariant && modelVariant.deletedAt == null) {
      modelVariant.deletedAt = new Date();
      await this.em.flush();
      return modelVariant;
    }
    return null;
  }
}
