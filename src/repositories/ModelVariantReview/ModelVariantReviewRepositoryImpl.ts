import { EntityManager } from "@mikro-orm/core";
import { ModelVariantReview } from "../../entities";
import {
  CreateModelVariantReviewDto,
  UpdateModelVariantReviewDto,
} from "../../types/modelVariantReview.types";
import { IModelVariantReviewRepository } from "./ModelVariantReviewRepository";

export class ModelRepositoryImpl implements IModelVariantReviewRepository {
  constructor(private readonly em: EntityManager) {}

  async findAll(): Promise<ModelVariantReview[]> {
    return this.em.find(ModelVariantReview, {});
  }

  async findById(id: string): Promise<ModelVariantReview | null> {
    return this.em.findOne(ModelVariantReview, { id });
  }

  async create(data: CreateModelVariantReviewDto): Promise<ModelVariantReview> {
    const model = this.em.create(ModelVariantReview, {
      modelVariant: data.modelVariant,
      rating: data.rating,
      comment: data.comment,
    });
    await this.em.persistAndFlush(model);
    return model;
  }

  async update(
    ModelVariantReview: ModelVariantReview,
    data: UpdateModelVariantReviewDto
  ): Promise<ModelVariantReview> {
    const updatedBank = this.em.assign(ModelVariantReview, data);
    await this.em.flush();
    return updatedBank;
  }

  async delete(id: string): Promise<ModelVariantReview | null> {
    const modelVariantReview = await this.findById(id);
    if (modelVariantReview && modelVariantReview.deletedAt == null) {
      modelVariantReview.deletedAt = new Date();
      await this.em.flush();
      return modelVariantReview;
    }
    return null;
  }
}
