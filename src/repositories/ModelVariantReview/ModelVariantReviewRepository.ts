import { ModelVariantReview } from "../../entities/index";
import {
  CreateModelVariantReviewDto,
  UpdateModelVariantReviewDto,
} from "../../types/modelVariantReview.types";

export interface IModelVariantReviewRepository {
  findAll(): Promise<ModelVariantReview[]>;
  findById(id: string): Promise<ModelVariantReview | null>;
  create(data: CreateModelVariantReviewDto): Promise<ModelVariantReview>;
  update(
    holiday: ModelVariantReview,
    data: UpdateModelVariantReviewDto
  ): Promise<ModelVariantReview>;
  delete(id: string): Promise<ModelVariantReview | null>;
}
