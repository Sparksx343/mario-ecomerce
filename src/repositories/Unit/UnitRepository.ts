import { Unit } from "../../entities/index";
import { CreateUnitDto, UpdateUnitDto } from "../../types/unit.types";

export interface IUnitRepository {
  findAll(): Promise<Unit[]>;
  findById(id: string): Promise<Unit | null>;
  create(data: CreateUnitDto): Promise<Unit>;
  update(holiday: Unit, data: UpdateUnitDto): Promise<Unit>;
  delete(id: string): Promise<Unit | null>;
}
