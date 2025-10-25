import { EntityManager } from "@mikro-orm/core";
import { Unit } from "../../entities";
import { CreateUnitDto, UpdateUnitDto } from "../../types/unit.types";
import { IUnitRepository } from "./UnitRepository";

export class UnitRepositoryImpl implements IUnitRepository {
  constructor(private readonly em: EntityManager) {}

  async findAll(): Promise<Unit[]> {
    return this.em.find(Unit, {});
  }

  async findById(id: string): Promise<Unit | null> {
    return this.em.findOne(Unit, { id });
  }

  async create(data: CreateUnitDto): Promise<Unit> {
    const unit = this.em.create(Unit, {
      name: data.name,
      symbol: data.symbol,
    });
    await this.em.persistAndFlush(unit);
    return unit;
  }

  async update(unit: Unit, data: UpdateUnitDto): Promise<Unit> {
    const updatedBank = this.em.assign(unit, data);
    await this.em.flush();
    return updatedBank;
  }

  async delete(id: string): Promise<Unit | null> {
    const unit = await this.findById(id);
    if (unit && unit.deletedAt == null) {
      unit.deletedAt = new Date();
      await this.em.flush();
      return unit;
    }
    return null;
  }
}
