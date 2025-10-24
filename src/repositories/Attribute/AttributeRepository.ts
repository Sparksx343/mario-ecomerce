import { Attribute } from "../../entities/index";
import {
  CreateAttributeDto,
  UpdateAttributeDto,
} from "../../types/attribute.types";

export interface IAttributeRepository {
  findAll(): Promise<Attribute[]>;
  findById(id: string): Promise<Attribute | null>;
  create(data: CreateAttributeDto): Promise<Attribute>;
  update(holiday: Attribute, data: UpdateAttributeDto): Promise<Attribute>;
  delete(id: string): Promise<Attribute | null>;
}
