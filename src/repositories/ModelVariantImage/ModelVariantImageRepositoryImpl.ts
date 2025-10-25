import { EntityManager } from "@mikro-orm/core";
import { ModelVariantImage } from "../../entities";
import {
  CreateModelVariantImageDto,
  UpdateModelVariantImageDto,
} from "../../types/modelVariantImage.types";
import { IModelVariantImageRepository } from "./ModelVariantImageRepository";

export class ModelRepositoryImpl implements IModelVariantImageRepository {
  constructor(private readonly em: EntityManager) {}

  async findAll(): Promise<ModelVariantImage[]> {
    return this.em.find(ModelVariantImage, {});
  }

  async findById(id: string): Promise<ModelVariantImage | null> {
    return this.em.findOne(ModelVariantImage, { id });
  }

  async create(data: CreateModelVariantImageDto): Promise<ModelVariantImage> {
    const model = this.em.create(ModelVariantImage, {
      imageType: data.imageType,
      imageUrl: data.imageUrl,
      modelVariant: data.modelVariant,
    });
    await this.em.persistAndFlush(model);
    return model;
  }

  async update(
    modelVariantImage: ModelVariantImage,
    data: UpdateModelVariantImageDto
  ): Promise<ModelVariantImage> {
    const updatedBank = this.em.assign(modelVariantImage, data);
    await this.em.flush();
    return updatedBank;
  }

  async delete(id: string): Promise<ModelVariantImage | null> {
    const modelVariantImage = await this.findById(id);
    if (modelVariantImage && modelVariantImage.deletedAt == null) {
      modelVariantImage.deletedAt = new Date();
      await this.em.flush();
      return modelVariantImage;
    }
    return null;
  }
}
