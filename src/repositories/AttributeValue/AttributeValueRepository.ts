import { AttributeValue } from "../../entities/index";
import {
  CreateAttributeValueDto,
  UpdateAttributeValueDto,
} from "../../types/attributeValue.types";

export interface IAttributeValueRepository {
  findAll(): Promise<AttributeValue[]>;
  findById(id: string): Promise<AttributeValue | null>;
  create(data: CreateAttributeValueDto): Promise<AttributeValue>;
  update(
    holiday: AttributeValue,
    data: UpdateAttributeValueDto
  ): Promise<AttributeValue>;
  delete(id: string): Promise<AttributeValue | null>;
}
