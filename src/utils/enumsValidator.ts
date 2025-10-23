export function isValidEnumKey<T extends object>(
  enumObj: T,
  key: PropertyKey
): key is keyof T {
  return key in enumObj;
}

export function isValidEnumValue<T extends object>(
  enumObj: T,
  value: unknown
): value is T[keyof T] {
  return Object.values(enumObj).includes(value as T[keyof T]);
}
