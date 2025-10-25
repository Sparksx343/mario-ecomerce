import { EntityManager } from "@mikro-orm/core";
import { ModelVariant } from "../../entities";
import {
  CreateModelVariantDto,
  UpdateModelVariantDto,
} from "../../types/modelVariant.types";
import { IModelVariantRepository } from "./ModelVariantRepository";

export class ModelRepositoryImpl implements IModelVariantRepository {
  constructor(private readonly em: EntityManager) {}

  async findAll(): Promise<ModelVariant[]> {
    return this.em.find(ModelVariant, {});
  }

  async findById(id: string): Promise<ModelVariant | null> {
    return this.em.findOne(ModelVariant, { id });
  }

  async create(data: CreateModelVariantDto): Promise<ModelVariant> {
    const model = this.em.create(ModelVariant, {
      model: data.model,
      price: data.price,
      sku: data.sku,
      stock: data.stock,
      averageRating: data.averageRating,
    });
    await this.em.persistAndFlush(model);
    return model;
  }

  async update(
    modelVariant: ModelVariant,
    data: UpdateModelVariantDto
  ): Promise<ModelVariant> {
    const updatedBank = this.em.assign(modelVariant, data);
    await this.em.flush();
    return updatedBank;
  }

  async delete(id: string): Promise<ModelVariant | null> {
    const modelVariant = await this.findById(id);
    if (modelVariant && modelVariant.deletedAt == null) {
      modelVariant.deletedAt = new Date();
      await this.em.flush();
      return modelVariant;
    }
    return null;
  }
}
