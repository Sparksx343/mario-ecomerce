import { MikroORM } from "@mikro-orm/postgresql";
import config from "../mikro-orm.config";

let _orm: MikroORM;

export const orm = async () => {
  if (!_orm) {
    _orm = await MikroORM.init(config);
  }
  return _orm;
};
