export function serializeError(error: unknown): Record<string, any> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  // Por si no es una instancia de Error (ej: throw 'texto')
  return {
    message: String(error),
  };
}
