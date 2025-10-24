import { Model } from "../../entities/index";
import { CreateModelDto, UpdateModelDto } from "../../types/model.types";

export interface IModelRepository {
  findAll(): Promise<Model[]>;
  findById(id: string): Promise<Model | null>;
  create(data: CreateModelDto): Promise<Model>;
  update(holiday: Model, data: UpdateModelDto): Promise<Model>;
  delete(id: string): Promise<Model | null>;
}
