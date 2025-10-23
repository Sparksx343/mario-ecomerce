// scripts/production-simulation.ts
import { orm } from "../config/database";
import { logger } from "../utils/logger";

// Importar todos los factories
import { createEmployeeFactory } from "../factories/employee.factory";
import { createEmployeeShiftFactory } from "../factories/employeeShift.factory";
import { createUserFactory } from "../factories/user.factory";
import { createHolidayFactory } from "../factories/holiday2.factory";
import { createVacationFactory } from "../factories/vacation.factory";
import { createPermissionFactory } from "../factories/permission.factory";
import { createPermissionTimeRangeFactory } from "../factories/permissionTimeRange.factory";
import { createPermissionShiftCompensationFactory } from "../factories/permissionShiftCompensation.factory";
import { createAttendanceFactory } from "../factories/attendance.factory";
import { createAttendancePeriodFactory } from "../factories/attendancePeriod.factory";
import { createOvertimeFactory } from "../factories/overtime.factory";

// Repositorios
import { ShiftRepositoryImpl } from "../repositories/Shift/ShiftRepositoryImpl";
import { es_MX, Faker } from "@faker-js/faker";

const faker = new Faker({
  locale: [es_MX],
});

interface SimulationConfig {
  employees: number;
  users: number;
  holidays: number;
  vacationsPerEmployee: number;
  permissionsPerEmployee: number;
  attendanceDaysBack: number;
  overtimePercentage: number; // Porcentaje de asistencias que tendrán overtime
}

const DEFAULT_CONFIG: SimulationConfig = {
  employees: 50,
  users: 5,
  holidays: 10,
  vacationsPerEmployee: 2,
  permissionsPerEmployee: 3,
  attendanceDaysBack: 90, // Simular 3 meses de asistencias
  overtimePercentage: 15, // 15% de las asistencias tendrán overtime
};

const generateDateRange = (daysBack: number): Date[] => {
  const dates: Date[] = [];
  const today = new Date();

  for (let i = daysBack; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date);
  }

  return dates;
};

const run = async () => {
  const configArg = process.argv[2];
  let config: SimulationConfig = DEFAULT_CONFIG;

  if (configArg) {
    try {
      const customConfig = JSON.parse(configArg);
      config = { ...DEFAULT_CONFIG, ...customConfig };
    } catch (error) {
      logger.warn("Configuración inválida, usando configuración por defecto");
      logger.error(error);
    }
  }

  logger.info(
    "🚀 Iniciando simulación de producción con configuración:",
    config
  );

  const ormInstance = await orm();

  try {
    await ormInstance.em.transactional(async (em) => {
      // Inicializar factories
      const createEmployee = createEmployeeFactory(em);
      const createEmployeeShift = createEmployeeShiftFactory(em);
      const createUser = createUserFactory(em);
      const createHoliday = createHolidayFactory(em);
      const createVacation = createVacationFactory(em);
      const createPermission = createPermissionFactory(em);
      const createPermissionTimeRange = createPermissionTimeRangeFactory(em);
      const createPermissionShiftCompensation =
        createPermissionShiftCompensationFactory(em);
      const createAttendance = createAttendanceFactory(em);
      const createAttendancePeriod = createAttendancePeriodFactory(em);
      const createOvertime = createOvertimeFactory(em);

      const shiftRepo = new ShiftRepositoryImpl(em);

      // 1. Crear usuarios administrativos
      logger.info("👥 Creando usuarios administrativos...");
      const users = await Promise.all(
        Array.from({ length: config.users }).map(() => createUser())
      );
      logger.info(`✅ ${users.length} usuarios creados`);

      // 2. Crear días festivos
      logger.info("🎉 Creando días festivos...");
      const holidays = await Promise.all(
        Array.from({ length: config.holidays }).map(() => createHoliday())
      );
      logger.info(`✅ ${holidays.length} días festivos creados`);

      // 3. Crear empleados
      logger.info("👷 Creando empleados...");
      const employees = await Promise.all(
        Array.from({ length: config.employees }).map(() => createEmployee())
      );
      logger.info(`✅ ${employees.length} empleados creados`);

      // 4. Asignar turnos a empleados
      logger.info("⏰ Asignando turnos a empleados...");
      const shifts = await shiftRepo.findAll();

      if (shifts.length === 0) {
        throw new Error("❌ No hay turnos disponibles. Crea turnos primero.");
      }

      for (const employee of employees) {
        const randomShift = faker.helpers.arrayElement(shifts);
        await createEmployeeShift(employee.id, randomShift.id);
      }
      logger.info(`✅ Turnos asignados a ${employees.length} empleados`);

      // 5. Crear vacaciones
      logger.info("🏖️ Creando vacaciones...");
      let vacationCount = 0;
      for (const employee of employees) {
        const vacationAmount = faker.number.int({
          min: 1,
          max: config.vacationsPerEmployee,
        });

        for (let i = 0; i < vacationAmount; i++) {
          const randomUser = faker.helpers.arrayElement(users);
          await createVacation(employee.id, randomUser.id);
          vacationCount++;
        }
      }
      logger.info(`✅ ${vacationCount} vacaciones creadas`);

      // 6. Crear permisos con sus rangos de tiempo y compensaciones
      logger.info("📝 Creando permisos...");
      let permissionCount = 0;
      for (const employee of employees) {
        const permissionAmount = faker.number.int({
          min: 1,
          max: config.permissionsPerEmployee,
        });

        for (let i = 0; i < permissionAmount; i++) {
          const randomUser = faker.helpers.arrayElement(users);
          const permission = await createPermission(employee.id, randomUser.id);

          // Crear rangos de tiempo para el permiso
          const timeRangeAmount = faker.number.int({ min: 1, max: 2 });
          for (let j = 1; j <= timeRangeAmount; j++) {
            await createPermissionTimeRange(permission.id, j);
          }

          // Crear compensaciones (solo para algunos permisos)
          if (faker.datatype.boolean() && permission.hoursToCompensate > 0) {
            const compensationAmount = faker.number.int({ min: 1, max: 2 });
            for (let k = 0; k < compensationAmount; k++) {
              await createPermissionShiftCompensation(
                permission.id,
                new Date()
              );
            }
          }

          permissionCount++;
        }
      }
      logger.info(
        `✅ ${permissionCount} permisos creados con sus rangos y compensaciones`
      );

      // 7. Crear asistencias con períodos
      logger.info("📊 Creando asistencias históricas...");
      const dateRange = generateDateRange(config.attendanceDaysBack);
      let attendanceCount = 0;
      let overtimeCount = 0;

      for (const employee of employees) {
        for (const date of dateRange) {
          // Decidir si el empleado asistió este día (90% probabilidad)
          if (faker.datatype.boolean(0.9)) {
            const attendance = await createAttendance(employee.id, date);

            // Crear períodos de asistencia (1-3 períodos por día)
            const periodAmount = faker.number.int({ min: 1, max: 3 });
            for (let p = 1; p <= periodAmount; p++) {
              await createAttendancePeriod(attendance.id, p);
            }

            // Crear overtime para algunos días
            if (faker.datatype.boolean(config.overtimePercentage / 100)) {
              const randomUser = faker.helpers.arrayElement(users);
              await createOvertime(attendance.id, employee.id, randomUser.id);
              overtimeCount++;
            }

            attendanceCount++;
          }
        }
      }

      logger.info(`✅ ${attendanceCount} asistencias creadas`);
      logger.info(`✅ ${overtimeCount} registros de horas extra creados`);

      // Estadísticas finales
      logger.info("\n📈 RESUMEN DE SIMULACIÓN:");
      logger.info(`👥 Usuarios: ${users.length}`);
      logger.info(`👷 Empleados: ${employees.length}`);
      logger.info(`🎉 Días festivos: ${holidays.length}`);
      logger.info(`🏖️ Vacaciones: ${vacationCount}`);
      logger.info(`📝 Permisos: ${permissionCount}`);
      logger.info(`📊 Asistencias: ${attendanceCount}`);
      logger.info(`⏰ Horas extra: ${overtimeCount}`);
      logger.info(`📅 Rango de fechas: ${config.attendanceDaysBack} días`);

      const totalRecords =
        users.length +
        employees.length +
        holidays.length +
        vacationCount +
        permissionCount +
        attendanceCount +
        overtimeCount;
      logger.info(`📋 Total de registros creados: ${totalRecords}`);
    });

    logger.info("🎉 ¡Simulación de producción completada exitosamente!");
  } catch (error) {
    logger.error("❌ Error durante la simulación:", error);
    throw error;
  } finally {
    await ormInstance.close();
  }
};

// Ejecutar el script
run().catch((err) => {
  logger.error("💥 Error crítico ejecutando simulación:", err);
  process.exit(1);
});

// Exportar para uso en otros scripts si es necesario
export { run as runProductionSimulation, DEFAULT_CONFIG };
