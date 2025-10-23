import { orm } from "../config/database";
import { Attendance, AttendancePeriod, Employee } from "../entities";
import { createAttendanceFactory } from "../factories/attendance.factory";
import { VacationRepositoryImpl } from "../repositories/Vacation/VacationRepositoryImpl";
import { PermissionRepositoryImpl } from "../repositories/Permission/PermissionRepositoryImpl";
import { HolidayRepositoryImpl } from "../repositories/Holiday/HolidayRepositoryImpl";
import { logger } from "../utils/logger";
import { DateTime } from "luxon";
import {
  AUTHORIZATION_STATUS,
  PERIOD_STATUS,
  ATTENDANCE_STATUS,
  ATTENDANCE_ORIGIN,
} from "../config/constants";
import { getDayOfWeek } from "../utils/dateTime";

// Utilitaria para agregar minutos a una hora
const addMinutes = (time: string, minutes: number): string => {
  const [hours, mins] = time.split(":").map(Number);
  const totalMinutes = (hours ? hours : 0) * 60 + (mins ? mins : 0) + minutes;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMins = totalMinutes % 60;
  return `${newHours.toString().padStart(2, "0")}:${newMins
    .toString()
    .padStart(2, "0")}`;
};

// Genera horarios realistas de entrada/salida
const generateRealisticCheckTimes = (
  scheduledIn: string,
  scheduledOut: string,
  toleranceMinutes: number
) => {
  const isLate = Math.random() < 0.15; // 15% llega tarde
  const leavesEarly = Math.random() < 0.08; // 8% se va temprano
  const takesBreak = Math.random() < 0.85; // 85% toma descanso

  let actualCheckIn = scheduledIn;
  let actualCheckOut = scheduledOut;

  if (isLate) {
    const lateMinutes = Math.floor(Math.random() * (toleranceMinutes + 15));
    actualCheckIn = addMinutes(scheduledIn, lateMinutes);
  } else if (Math.random() < 0.6) {
    const earlyMinutes = Math.floor(Math.random() * 5);
    actualCheckIn = addMinutes(scheduledIn, -earlyMinutes);
  }

  if (leavesEarly) {
    const earlyMinutes = Math.floor(Math.random() * 20);
    actualCheckOut = addMinutes(scheduledOut, -earlyMinutes);
  } else if (Math.random() < 0.25) {
    const extraMinutes = Math.floor(Math.random() * 30);
    actualCheckOut = addMinutes(scheduledOut, extraMinutes);
  }

  return {
    actualCheckIn: `${actualCheckIn}:00`,
    actualCheckOut: `${actualCheckOut}:00`,
    takesBreak,
  };
};

// Crear AttendancePeriod para días regulares
const createRegularAttendancePeriod = async (
  em: any,
  attendance: Attendance,
  workPeriod: any,
  dailyShift: any
): Promise<AttendancePeriod> => {
  const attendancePeriod = new AttendancePeriod();

  // Datos base
  attendancePeriod.attendance = attendance;
  attendancePeriod.periodOrder = workPeriod.order;
  attendancePeriod.scheduledCheckIn = workPeriod.checkIn;
  attendancePeriod.scheduledCheckOut = workPeriod.checkOut;
  attendancePeriod.scheduledBreakStart = workPeriod.breakStart || null;
  attendancePeriod.scheduledBreakEnd = workPeriod.breakEnd || null;
  attendancePeriod.toleranceMinutes = dailyShift.shift.toleranceMinutes;
  attendancePeriod.autoclosed = false;

  // 92% de asistencia para días regulares
  const willAttend = Math.random() < 0.92;

  if (willAttend) {
    const { actualCheckIn, actualCheckOut, takesBreak } =
      generateRealisticCheckTimes(
        workPeriod.checkIn,
        workPeriod.checkOut,
        dailyShift.shift.toleranceMinutes
      );

    attendancePeriod.actualCheckIn = actualCheckIn;
    attendancePeriod.actualCheckOut = actualCheckOut;

    if (takesBreak && workPeriod.breakStart && workPeriod.breakEnd) {
      attendancePeriod.actualBreakStart = `${workPeriod.breakStart}:00`;
      attendancePeriod.actualBreakEnd = `${workPeriod.breakEnd}:00`;
    }

    // Calcular minutos tarde/temprano
    const [scheduledHour, scheduledMin] = workPeriod.checkIn
      .split(":")
      .map(Number);
    const [actualHour, actualMin] = actualCheckIn.split(":").map(Number);
    const scheduledInMinutes = scheduledHour * 60 + scheduledMin;
    const actualInMinutes = (actualHour || 0) * 60 + (actualMin || 0);
    const lateDiff = actualInMinutes - scheduledInMinutes;

    attendancePeriod.minutesLate = lateDiff > 0 ? lateDiff : 0;
    attendancePeriod.minutesEarly = lateDiff < 0 ? Math.abs(lateDiff) : 0;
    attendancePeriod.status = PERIOD_STATUS.CHECKED_OUT;
  } else {
    // No asistió
    attendancePeriod.actualCheckIn = undefined;
    attendancePeriod.actualCheckOut = undefined;
    attendancePeriod.actualBreakStart = undefined;
    attendancePeriod.actualBreakEnd = undefined;
    attendancePeriod.status = PERIOD_STATUS.MISSED;
    attendancePeriod.minutesLate = 0;
    attendancePeriod.minutesEarly = 0;
  }

  await em.persistAndFlush(attendancePeriod);
  return attendancePeriod;
};

// Crear AttendancePeriod para vacaciones/días festivos
const createHolidayVacationAttendancePeriod = async (
  em: any,
  attendance: Attendance,
  workPeriod: any,
  dailyShift: any
): Promise<AttendancePeriod> => {
  const attendancePeriod = new AttendancePeriod();

  // Datos base
  attendancePeriod.attendance = attendance;
  attendancePeriod.periodOrder = workPeriod.order;
  attendancePeriod.scheduledCheckIn = workPeriod.checkIn;
  attendancePeriod.scheduledCheckOut = workPeriod.checkOut;
  attendancePeriod.scheduledBreakStart = workPeriod.breakStart || null;
  attendancePeriod.scheduledBreakEnd = workPeriod.breakEnd || null;
  attendancePeriod.toleranceMinutes = dailyShift.shift.toleranceMinutes;
  attendancePeriod.autoclosed = false;

  // Asistencia perfecta automática para vacaciones/festivos
  attendancePeriod.actualCheckIn = `${workPeriod.checkIn}:00`;
  attendancePeriod.actualCheckOut = `${workPeriod.checkOut}:00`;
  attendancePeriod.actualBreakStart = workPeriod.breakStart
    ? `${workPeriod.breakStart}:00`
    : undefined;
  attendancePeriod.actualBreakEnd = workPeriod.breakEnd
    ? `${workPeriod.breakEnd}:00`
    : undefined;
  attendancePeriod.status = PERIOD_STATUS.CHECKED_OUT;
  attendancePeriod.minutesLate = 0;
  attendancePeriod.minutesEarly = 0;

  await em.persistAndFlush(attendancePeriod);
  return attendancePeriod;
};

// Crear AttendancePeriods basados en TimeRanges del permiso
const createPermissionAttendancePeriods = async (
  em: any,
  attendance: Attendance,
  permission: any
): Promise<AttendancePeriod[]> => {
  const periods: AttendancePeriod[] = [];

  // Procesar timeRanges del permiso
  if (permission.timeRanges && permission.timeRanges.length > 0) {
    for (let i = 0; i < permission.timeRanges.length; i++) {
      const timeRange = permission.timeRanges[i];

      const attendancePeriod = new AttendancePeriod();
      attendancePeriod.attendance = attendance;
      attendancePeriod.periodOrder = i + 1;

      // Mapear campos de TimeRange a AttendancePeriod
      // Nota: Ajusta estos campos según tu estructura real de TimeRange
      attendancePeriod.scheduledCheckIn = timeRange.startTime;
      attendancePeriod.scheduledCheckOut = timeRange.endTime;
      attendancePeriod.actualCheckIn = timeRange.startTime
        ? `${timeRange.startTime}:00`
        : undefined;
      attendancePeriod.actualCheckOut = timeRange.endTime
        ? `${timeRange.endTime}:00`
        : undefined;

      // Configurar como justificado por permiso
      attendancePeriod.status = PERIOD_STATUS.CHECKED_OUT; // o el status que corresponda
      attendancePeriod.minutesLate = 0;
      attendancePeriod.minutesEarly = 0;
      attendancePeriod.toleranceMinutes = 0;
      attendancePeriod.autoclosed = false;

      await em.persistAndFlush(attendancePeriod);
      periods.push(attendancePeriod);
    }
  }

  return periods;
};

// Crear Attendances adicionales basados en ShiftCompensation
const createShiftCompensationAttendances = async (
  em: any,
  permission: any,
  employee: Employee,
  createAttendance: any
): Promise<Attendance[]> => {
  const compensationAttendances: Attendance[] = [];

  if (permission.shiftCompensation && permission.shiftCompensation.length > 0) {
    for (const compensation of permission.shiftCompensation) {
      const compensationDate = new Date(compensation.date);

      // Crear attendance para el día de compensación
      const attendance = await createAttendance(employee.id, compensationDate, {
        permission: permission,
        status: ATTENDANCE_STATUS.JUSTIFIED, // o el status que corresponda
        origin: ATTENDANCE_ORIGIN.PERMISSION_COMPENSATION, // ajustar según tus constantes
        // NO llenar extra_hours aquí - se hace en otro factory
      });

      // Crear AttendancePeriods basados en los datos de compensación
      // Ajustar según la estructura de ShiftCompensation
      const attendancePeriod = new AttendancePeriod();
      attendancePeriod.attendance = attendance;
      attendancePeriod.periodOrder = 1;

      // Mapear campos de ShiftCompensation (ajustar según estructura real)
      if (compensation.startTime && compensation.endTime) {
        attendancePeriod.scheduledCheckIn = compensation.startTime;
        attendancePeriod.scheduledCheckOut = compensation.endTime;
        attendancePeriod.actualCheckIn = `${compensation.startTime}:00`;
        attendancePeriod.actualCheckOut = `${compensation.endTime}:00`;
        attendancePeriod.status = PERIOD_STATUS.CHECKED_OUT;
        attendancePeriod.minutesLate = 0;
        attendancePeriod.minutesEarly = 0;
        attendancePeriod.toleranceMinutes = 0;
        attendancePeriod.autoclosed = false;

        await em.persistAndFlush(attendancePeriod);
      }

      compensationAttendances.push(attendance);
    }
  }

  return compensationAttendances;
};

const run = async () => {
  const count = parseInt(process.argv[2] || "1", 10);
  const ormInstance = await orm();

  await ormInstance.em.transactional(async (em) => {
    const createAttendance = createAttendanceFactory(em);
    const vacationRepo = new VacationRepositoryImpl(em);
    const permissionRepo = new PermissionRepositoryImpl(em);
    const holidayRepo = new HolidayRepositoryImpl(em);

    const employees: Employee[] = await em.find(
      Employee,
      {},
      {
        populate: ["shifts.shift.dailyShifts.workPeriods"],
      }
    );

    const attendances = (
      await Promise.all(
        employees.map((emp) =>
          Promise.all(
            Array.from({ length: count }).map(async (_, index) => {
              const date = DateTime.now()
                .plus({ days: index + 1 })
                .toJSDate();

              try {
                // Obtener contexto del día
                const vacation = await vacationRepo.findByEmployeeIdAndDate(
                  emp.id,
                  date
                );
                const holiday = await holidayRepo.findByDate(date);
                const permission = await permissionRepo.findByEmployeeIdAndDate(
                  emp.id,
                  date
                );

                const isApprovedVacation =
                  vacation?.status === AUTHORIZATION_STATUS.APPROVED;
                const isHoliday = !!holiday;
                const isApprovedPermission =
                  permission?.status === AUTHORIZATION_STATUS.APPROVED;

                logger.info(
                  `Procesando empleado ${emp.id} para fecha ${
                    date.toISOString().split("T")[0]
                  }`
                );
                logger.info(
                  `Contexto: holiday=${isHoliday}, vacation=${isApprovedVacation}, permission=${isApprovedPermission}`
                );

                // Obtener el turno actual
                const currentShift = emp.shifts
                  .getItems()
                  .find(
                    (es) =>
                      es.startDate <= date &&
                      (!es.endDate || es.endDate >= date)
                  );

                if (!currentShift) {
                  logger.warn(
                    `Empleado ${emp.id} sin turno asignado para fecha ${
                      date.toISOString().split("T")[0]
                    }`
                  );
                  return null;
                }

                const dailyShift = currentShift.shift.dailyShifts
                  .getItems()
                  .find((ds) => ds.dayOfWeek === getDayOfWeek(date));

                if (!dailyShift) {
                  logger.warn(
                    `Empleado ${emp.id} sin dailyShift para día ${getDayOfWeek(
                      date
                    )}`
                  );
                  return null;
                }

                // Preparar datos para crear attendance
                const attendanceOverrides: Partial<Attendance> = {};
                let attendanceStatus = ATTENDANCE_STATUS.PRESENT;
                let attendanceOrigin = ATTENDANCE_ORIGIN.REGULAR;

                // Determinar tipo de día y configurar attendance
                if (isHoliday) {
                  attendanceOverrides.holiday = holiday;
                  attendanceStatus = ATTENDANCE_STATUS.HOLIDAY;
                  attendanceOrigin = ATTENDANCE_ORIGIN.HOLIDAY;
                } else if (isApprovedVacation) {
                  attendanceOverrides.vacation = vacation;
                  attendanceStatus = ATTENDANCE_STATUS.VACATION;
                  attendanceOrigin = ATTENDANCE_ORIGIN.VACATION;
                } else if (isApprovedPermission) {
                  attendanceOverrides.permission = permission;
                  attendanceStatus = ATTENDANCE_STATUS.JUSTIFIED;
                  attendanceOrigin = ATTENDANCE_ORIGIN.PERMISSION_DAY;
                }

                // Crear el attendance principal
                const attendance = await createAttendance(emp.id, date, {
                  ...attendanceOverrides,
                  status: attendanceStatus,
                  origin: attendanceOrigin,
                  // NO llenar extra_hours - se hace en otro factory
                  extra_hours: undefined,
                });

                // Crear AttendancePeriods según el tipo de día
                if (isApprovedPermission) {
                  // Para permisos: usar timeRanges para crear periods
                  await createPermissionAttendancePeriods(
                    em,
                    attendance,
                    permission
                  );

                  // Crear attendances adicionales por shiftCompensation
                  await createShiftCompensationAttendances(
                    em,
                    permission,
                    emp,
                    createAttendance
                  );
                } else if (isHoliday || isApprovedVacation) {
                  // Para vacaciones/festivos: crear periods con asistencia perfecta
                  const periods = dailyShift.workPeriods.getItems();
                  for (const wp of periods) {
                    await createHolidayVacationAttendancePeriod(
                      em,
                      attendance,
                      wp,
                      dailyShift
                    );
                  }
                } else {
                  // Para días regulares: crear periods con lógica realista
                  const periods = dailyShift.workPeriods.getItems();
                  for (const wp of periods) {
                    await createRegularAttendancePeriod(
                      em,
                      attendance,
                      wp,
                      dailyShift
                    );
                  }
                }

                return attendance;
              } catch (err) {
                logger.error(
                  `Error creando asistencia para empleado ${
                    emp.id
                  } en fecha ${date.toISOString()}: ${err}`
                );
                return null;
              }
            })
          )
        )
      )
    )
      .flat()
      .filter(Boolean);

    logger.info(`${attendances.length} asistencias creadas exitosamente`);
  });

  await ormInstance.close();
};

run().catch((err) => {
  logger.error("Error ejecutando factory:", err);
  process.exit(1);
});
