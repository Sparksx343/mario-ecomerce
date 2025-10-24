import { EntityManager } from "@mikro-orm/core";
import { AttributeValue } from "../../entities";
import {
  CreateAttributeValueDto,
  UpdateAttributeValueDto,
} from "../../types/attributeValue.types";
import { IAttributeValueRepository } from "./AttributeValueRepository";

export class AttributeValueRepositoryImpl implements IAttributeValueRepository {
  constructor(private readonly em: EntityManager) {}

  async findAll(): Promise<AttributeValue[]> {
    return this.em.find(AttributeValue, {});
  }

  async findById(id: string): Promise<AttributeValue | null> {
    return this.em.findOne(AttributeValue, { id });
  }

  async create(data: CreateAttributeValueDto): Promise<AttributeValue> {
    const attributeValue = this.em.create(AttributeValue, {
      attribute: data.attribute,
      value: data.value,
    });
    await this.em.persistAndFlush(attributeValue);
    return attributeValue;
  }

  async update(
    attribute: AttributeValue,
    data: UpdateAttributeValueDto
  ): Promise<AttributeValue> {
    const updatedBank = this.em.assign(attribute, data);
    await this.em.flush();
    return updatedBank;
  }

  async delete(id: string): Promise<AttributeValue | null> {
    const attributeValue = await this.findById(id);
    if (attributeValue && attributeValue.deletedAt == null) {
      attributeValue.deletedAt = new Date();
      await this.em.flush();
      return attributeValue;
    }
    return null;
  }
}
