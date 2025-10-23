import { runProductionSimulation } from "./production-simulation";
import { logger } from "../utils/logger";

interface SimulationScenario {
  name: string;
  description: string;
  config: {
    employees: number;
    users: number;
    useRealHolidays: boolean; // Cambio: usar días festivos reales en lugar de número
    vacationsPerEmployee: number;
    permissionsPerEmployee: number;
    attendanceDaysBack: number;
    overtimePercentage: number;
  };
}

const SCENARIOS: Record<string, SimulationScenario> = {
  small: {
    name: "Empresa Pequeña",
    description: "Simulación para empresa pequeña (10-20 empleados)",
    config: {
      employees: 15,
      users: 3,
      useRealHolidays: true,
      vacationsPerEmployee: 1,
      permissionsPerEmployee: 2,
      attendanceDaysBack: 30,
      overtimePercentage: 10,
    },
  },

  medium: {
    name: "Empresa Mediana",
    description: "Simulación para empresa mediana (50-100 empleados)",
    config: {
      employees: 75,
      users: 8,
      useRealHolidays: true,
      vacationsPerEmployee: 2,
      permissionsPerEmployee: 4,
      attendanceDaysBack: 60,
      overtimePercentage: 15,
    },
  },

  large: {
    name: "Empresa Grande",
    description: "Simulación para empresa grande (200+ empleados)",
    config: {
      employees: 250,
      users: 15,
      useRealHolidays: true,
      vacationsPerEmployee: 3,
      permissionsPerEmployee: 5,
      attendanceDaysBack: 120,
      overtimePercentage: 20,
    },
  },

  development: {
    name: "Desarrollo",
    description: "Datos mínimos para desarrollo y pruebas rápidas",
    config: {
      employees: 5,
      users: 2,
      useRealHolidays: true,
      vacationsPerEmployee: 1,
      permissionsPerEmployee: 1,
      attendanceDaysBack: 14,
      overtimePercentage: 5,
    },
  },

  stress_test: {
    name: "Prueba de Estrés",
    description:
      "Simulación con gran volumen de datos para pruebas de rendimiento",
    config: {
      employees: 500,
      users: 25,
      useRealHolidays: true,
      vacationsPerEmployee: 4,
      permissionsPerEmployee: 8,
      attendanceDaysBack: 180,
      overtimePercentage: 25,
    },
  },

  minimal: {
    name: "Mínimo",
    description: "Configuración mínima para pruebas unitarias",
    config: {
      employees: 2,
      users: 1,
      useRealHolidays: true,
      vacationsPerEmployee: 1,
      permissionsPerEmployee: 1,
      attendanceDaysBack: 7,
      overtimePercentage: 0,
    },
  },
};

const displayScenarios = () => {
  logger.info("\n🎯 ESCENARIOS DISPONIBLES:");
  logger.info("=".repeat(50));

  Object.entries(SCENARIOS).forEach(([key, scenario]) => {
    logger.info(`\n📋 ${key.toUpperCase()}: ${scenario.name}`);
    logger.info(`   ${scenario.description}`);
    logger.info(`   👷 Empleados: ${scenario.config.employees}`);
    logger.info(`   👥 Usuarios: ${scenario.config.users}`);
    logger.info(`   📅 Días atrás: ${scenario.config.attendanceDaysBack}`);
    logger.info(
      `   🎉 Días festivos: ${
        scenario.config.useRealHolidays ? "Mexicanos oficiales" : "Ninguno"
      }`
    );
  });

  logger.info("\n💡 Uso:");
  logger.info("   npm run simulation [escenario]");
  logger.info("   node dist/scripts/simulation-scenarios.js [escenario]");
  logger.info("\n   Ejemplos:");
  logger.info("   npm run simulation small");
  logger.info("   npm run simulation medium");
  logger.info("   npm run simulation development");
};

const calculateEstimatedRecords = (scenario: SimulationScenario) => {
  const { config } = scenario;

  // Cálculos estimados
  const employees = config.employees;
  const users = config.users;
  const holidays = config.useRealHolidays ? 11 : 0; // 11 días festivos mexicanos oficiales
  const vacations = employees * config.vacationsPerEmployee;
  const permissions = employees * config.permissionsPerEmployee;
  const attendanceDays = config.attendanceDaysBack;
  const attendances = Math.floor(employees * attendanceDays * 0.9); // 90% asistencia
  const attendancePeriods = attendances * 1.5; // Promedio 1.5 períodos por asistencia
  const overtimes = Math.floor(attendances * (config.overtimePercentage / 100));
  const permissionTimeRanges = permissions * 1.2; // Promedio 1.2 rangos por permiso
  const compensations = Math.floor(permissions * 0.3); // 30% tienen compensación

  const total =
    employees +
    users +
    holidays +
    vacations +
    permissions +
    attendances +
    attendancePeriods +
    overtimes +
    permissionTimeRanges +
    compensations;

  return {
    employees,
    users,
    holidays,
    vacations,
    permissions,
    attendances,
    attendancePeriods,
    overtimes,
    permissionTimeRanges,
    compensations,
    total,
  };
};

const runScenario = async (scenarioKey: string) => {
  const scenario = SCENARIOS[scenarioKey];

  if (!scenario) {
    logger.error(`❌ Escenario '${scenarioKey}' no encontrado`);
    displayScenarios();
    process.exit(1);
  }

  logger.info(`\n🎯 Ejecutando escenario: ${scenario.name}`);
  logger.info(`📝 ${scenario.description}`);

  const estimates = calculateEstimatedRecords(scenario);
  logger.info(`\n📊 Registros estimados a crear:`);
  logger.info(`   👷 Empleados: ${estimates.employees}`);
  logger.info(`   👥 Usuarios: ${estimates.users}`);
  logger.info(`   🎉 Días festivos: ${estimates.holidays}`);
  logger.info(`   🏖️ Vacaciones: ${estimates.vacations}`);
  logger.info(`   📝 Permisos: ${estimates.permissions}`);
  logger.info(`   📊 Asistencias: ${estimates.attendances}`);
  logger.info(`   ⏰ Horas extra: ${estimates.overtimes}`);
  logger.info(`   📋 Total estimado: ${estimates.total} registros`);

  const timeEstimate = Math.ceil(estimates.total / 100); // Estimación rough
  logger.info(`   ⏱️ Tiempo estimado: ~${timeEstimate} segundos`);

  logger.info(`\n🚀 Iniciando en 3 segundos...`);
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Ejecutar la simulación con la configuración del escenario
  const originalArgv = process.argv;
  process.argv = [
    process.argv[0]!,
    process.argv[1]!,
    JSON.stringify(scenario.config),
  ];

  try {
    await runProductionSimulation();
    logger.info(`\n✅ Escenario '${scenario.name}' completado exitosamente`);
  } catch (error) {
    logger.error(`❌ Error ejecutando escenario '${scenario.name}':`, error);
    throw error;
  } finally {
    process.argv = originalArgv;
  }
};

// Script principal
const main = async () => {
  const scenarioArg = process.argv[2];

  if (!scenarioArg || scenarioArg === "help" || scenarioArg === "--help") {
    displayScenarios();
    return;
  }

  if (scenarioArg === "list") {
    displayScenarios();
    return;
  }

  if (scenarioArg === "estimates") {
    logger.info("\n📊 ESTIMACIONES DE REGISTROS POR ESCENARIO:");
    logger.info("=".repeat(60));

    Object.entries(SCENARIOS).forEach(([key, scenario]) => {
      const estimates = calculateEstimatedRecords(scenario);
      logger.info(`\n${scenario.name} (${key}):`);
      logger.info(
        `  Total estimado: ${estimates.total.toLocaleString()} registros`
      );
      logger.info(
        `  Empleados: ${
          estimates.employees
        } | Asistencias: ${estimates.attendances.toLocaleString()}`
      );
    });
    return;
  }

  await runScenario(scenarioArg);
};

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch((err) => {
    logger.error("💥 Error crítico:", err);
    process.exit(1);
  });
}

export { SCENARIOS, runScenario, calculateEstimatedRecords };
