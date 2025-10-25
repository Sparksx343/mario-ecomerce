export interface CreateUnitDto {
  name: string;
  symbol: string;
}
export type UpdateUnitDto = Partial<CreateUnitDto>;
