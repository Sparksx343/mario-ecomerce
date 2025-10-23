import bcrypt from "bcrypt";
export function hasher(valToHash: string): string {
  const hash = bcrypt.hashSync(valToHash, 10);
  return hash;
}

export function comparePassword(plainTxtPwd: string, hashPwd: string): boolean {
  const result = bcrypt.compareSync(plainTxtPwd, hashPwd);
  return result;
}
