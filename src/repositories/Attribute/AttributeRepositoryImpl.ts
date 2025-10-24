import { EntityManager } from "@mikro-orm/core";
import { Attribute } from "../../entities";
import {
  CreateAttributeDto,
  UpdateAttributeDto,
} from "../../types/attribute.types";
import { IAttributeRepository } from "./AttributeRepository";

export class AttributeRepositoryImpl implements IAttributeRepository {
  constructor(private readonly em: EntityManager) {}

  async findAll(): Promise<Attribute[]> {
    return this.em.find(Attribute, {});
  }

  async findById(id: string): Promise<Attribute | null> {
    return this.em.findOne(Attribute, { id });
  }

  async create(data: CreateAttributeDto): Promise<Attribute> {
    const attribute = this.em.create(Attribute, {
      name: data.name,
    });
    await this.em.persistAndFlush(attribute);
    return attribute;
  }

  async update(
    attribute: Attribute,
    data: UpdateAttributeDto
  ): Promise<Attribute> {
    const updatedBank = this.em.assign(attribute, data);
    await this.em.flush();
    return updatedBank;
  }

  async delete(id: string): Promise<Attribute | null> {
    const attribute = await this.findById(id);
    if (attribute && attribute.deletedAt == null) {
      attribute.deletedAt = new Date();
      await this.em.flush();
      return attribute;
    }
    return null;
  }
}
