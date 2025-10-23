// Fisher-Yates Shuffle
export function arrayGetRandomElements<T>(array: T[], cantidad: number): T[] {
  if (cantidad > array.length) {
    throw new Error(
      `La cantidad solicitada (${cantidad}) excede el tamaño del arreglo (${array.length})`
    );
  }

  const copy: T[] = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j: number = Math.floor(Math.random() * (i + 1));

    // Aseguramos a TypeScript que los índices están en rango
    const a = copy[i]!;
    const b = copy[j]!;

    copy[i] = b;
    copy[j] = a;
  }

  return copy.slice(0, cantidad);
}
