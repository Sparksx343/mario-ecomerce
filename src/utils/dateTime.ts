import { DateTime } from "luxon";
import dotenv from "dotenv";
dotenv.config();

const ZONA = process.env.TIMEZONE || "America/Mexico_City";
const LOCALE = process.env.LOCALE || "es-MX";

// Salida: "08:30:00"
export function formatedTime(): string {
  return DateTime.now()
    .setZone(ZONA)
    .toLocaleString(DateTime.TIME_24_WITH_SECONDS, { locale: LOCALE });
}

// YYYY-MM-DD
export function getDayWithoutTime(): string {
  return DateTime.now().setZone(ZONA).toFormat("yyyy-MM-dd");
}

export function timeToMinutes(time: string): number {
  let dt = DateTime.fromFormat(time, "HH:mm");

  if (!dt.isValid) {
    dt = DateTime.fromFormat(time, "HH:mm:ss");
  }

  if (!dt.isValid) {
    throw new Error("Hora inválida: " + time);
  }

  return dt.hour * 60 + dt.minute;
}

// Queremos: lunes = 0, martes = 1, ..., domingo = 6
export function getDayOfWeek(date: Date = nowInMexicoCity()): number {
  const dt = DateTime.fromJSDate(date, { zone: ZONA });
  const weekday = dt.weekday; // Luxon: 1 (lunes) to 7 (domingo)
  return weekday === 7 ? 6 : weekday - 1;
}

// return new Date(Date.UTC(year, month - 1, day, hour, minute, second));

export function nowInMexicoCity(input: Date | string = new Date()): Date {
  const dateTime =
    typeof input === "string"
      ? DateTime.fromISO(input, { zone: ZONA })
      : DateTime.fromJSDate(input, { zone: ZONA });

  return dateTime.toJSDate();
}

export function addMinutesToDate(date: Date, minutes: number): Date {
  return DateTime.fromJSDate(date).plus({ minutes }).toJSDate();
}

export function calcExtraHours(
  fecha: Date,
  hora: string,
  horaActual: Date
): number {
  // necesita fecha en ISO yyyy-MM-dd
  const fechaISO = DateTime.fromJSDate(fecha).toISODate(); // "2025-06-03"

  const inicio = DateTime.fromISO(`${fechaISO}T${hora}`);
  const actual = DateTime.fromJSDate(horaActual);

  if (actual <= inicio) return 0;

  const diffInMinutes = actual.diff(inicio, "minutes").minutes;

  const horasExtras = Math.floor(diffInMinutes / 60);
  const minutosRestantes = diffInMinutes % 60;

  return minutosRestantes >= 45 ? horasExtras + 1 : horasExtras;
}

export function getMexicanHolidays(year: number): string[] {
  const formatDate = (date: Date): string =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;

  // Encuentra el lunes más cercano hacia adelante (para festivos movibles)
  const nearestMonday = (date: Date): Date => {
    const day = date.getDay();
    const offset = day === 0 ? 1 : day === 1 ? 0 : 8 - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + offset);
    return monday;
  };

  // Cálculo de la fecha de Pascua (Easter) con algoritmo de Meeus
  function getEasterDate(y: number): Date {
    const f = Math.floor,
      G = y % 19,
      C = f(y / 100),
      H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
      I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)),
      J = (y + f(y / 4) + I + 2 - C + f(C / 4)) % 7,
      L = I - J,
      month = 3 + f((L + 40) / 44),
      day = L + 28 - 31 * f(month / 4);
    return new Date(y, month - 1, day);
  }

  // Semana Santa
  const easter = getEasterDate(year);
  const holyThursday = new Date(easter);
  holyThursday.setDate(easter.getDate() - 3);
  const holyFriday = new Date(easter);
  holyFriday.setDate(easter.getDate() - 2);

  const holidays: Date[] = [
    new Date(year, 0, 1), // Año Nuevo
    nearestMonday(new Date(year, 1, 5)), // Día de la Constitución
    nearestMonday(new Date(year, 2, 21)), // Natalicio de Benito Juárez
    new Date(year, 4, 1), // Día del Trabajo
    new Date(year, 8, 16), // Independencia de México
    nearestMonday(new Date(year, 10, 20)), // Revolución Mexicana
    new Date(year, 11, 25), // Navidad
    holyThursday, // Jueves Santo
    holyFriday, // Viernes Santo
  ];

  return holidays.map(formatDate);
}
