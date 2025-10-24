import { EntityManager } from "@mikro-orm/core";
import { Model } from "../../entities";
import { CreateModelDto, UpdateModelDto } from "../../types/model.types";
import { IModelRepository } from "./ModelRepository";

export class ModelRepositoryImpl implements IModelRepository {
  constructor(private readonly em: EntityManager) {}

  async findAll(): Promise<Model[]> {
    return this.em.find(Model, {});
  }

  async findById(id: string): Promise<Model | null> {
    return this.em.findOne(Model, { id });
  }

  async create(data: CreateModelDto): Promise<Model> {
    const model = this.em.create(Model, {
      name: data.name,
    });
    await this.em.persistAndFlush(model);
    return model;
  }

  async update(model: Model, data: UpdateModelDto): Promise<Model> {
    const updatedBank = this.em.assign(model, data);
    await this.em.flush();
    return updatedBank;
  }

  async delete(id: string): Promise<Model | null> {
    const model = await this.findById(id);
    if (model && model.deletedAt == null) {
      model.deletedAt = new Date();
      await this.em.flush();
      return model;
    }
    return null;
  }
}
