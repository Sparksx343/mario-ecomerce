Comando para checar errores de Typescript

```
npx tsc --noEmit
```

Comando para checar errores de Es-Lint

```
eslint . --ext .ts
```

Comando para Generar las migraciones

```
npm run mikro:generate
```

Comando para Ejecutar las migraciones

```
npm run mikro:up
```

Comando para Eliminar las tablas

```
npm run mikro:down
```

Comando para Borrar datos de las tablas

```
npm run mikro:refresh
```

Comando para Ejecutar los seeders

```
npm run mikro:seed
```

Comando para Ejecutar el factory de empleados (acepta cantidad)

```
npm run employeeFactory 1
```

Comando para Ejecutar el factory de horarios (acepta cantidad)

```
npm run shiftFactory 1
```

claude:
// ===== PASO 1: Crear la clase Unit of Work =====
export class UnitOfWork {
constructor(private readonly em: EntityManager) {}

// ✅ SÍ, debes declarar TODOS los repos que necesiten transacciones
get attendanceRepository(): IAttendanceRepository {
return new AttendanceRepositoryImpl(this.em, this.attendancePeriodRepository);
}

get attendancePeriodRepository(): IAttendancePeriodRepository {
return new AttendancePeriodRepositoryImpl(this.em);
}

get employeeRepository(): IEmployeeRepository {
return new EmployeeRepositoryImpl(this.em);
}

// Agregar más repositorios según necesites
// get otherRepository(): IOtherRepository {
// return new OtherRepositoryImpl(this.em);
// }

// Este método es la "magia" - ejecuta todo en una transacción
async executeTransaction<T>(operation: (uow: UnitOfWork) => Promise<T>): Promise<T> {
return this.em.transactional(async (transactionalEm) => {
// Crear un nuevo UoW con el EntityManager transaccional
const transactionalUoW = new UnitOfWork(transactionalEm);
return operation(transactionalUoW);
});
}
}

// ===== PASO 2: Simplificar los repositorios =====
// Ya NO necesitas withEntityManager en los repositorios!
export class AttendanceRepositoryImpl implements IAttendanceRepository {
constructor(
private readonly em: EntityManager,
private readonly attendancePeriodRepo: IAttendancePeriodRepository
) {}

// ✅ Métodos normales - sin transacciones aquí
async create(data: CreateAttendanceDto): Promise<Attendance> {
// Solo la lógica de creación, SIN transaccional
const attendance = this.em.create(Attendance, {
date: data.date,
employee: data.employeeId,
origin: data.origin,
status: data.status,
});

    await this.em.persistAndFlush(attendance);

    // Crear períodos usando el repo inyectado
    for (const period of data.attendancePeriods) {
      await this.attendancePeriodRepo.create({
        ...period,
        attendanceId: attendance.id,
      });
    }

    return this.em.findOneOrFail(
      Attendance,
      { id: attendance.id },
      { populate: ["attendancePeriods"] }
    );

}

async delete(attendance: Attendance): Promise<void> {
// Solo la lógica de eliminación, SIN transaccional
this.em.assign(attendance, { deletedAt: nowInMexicoCity() });

    const attendancePeriods = await this.attendancePeriodRepo
      .findByAttendanceId(attendance.id);

    if (attendancePeriods) {
      for (const period of attendancePeriods) {
        await this.attendancePeriodRepo.delete(period);
      }
    }

    await this.em.flush();

}

// ... otros métodos sin cambios
}

// ===== PASO 3: Modificar el Service =====
export class AttendanceService {
constructor(
private readonly attendanceRepository: IAttendanceRepository,
private readonly employeeRepository: IEmployeeRepository,
private readonly unitOfWork: UnitOfWork // ✅ Inyectar UoW
) {}

// ✅ Métodos que NO necesitan transacciones - usan repos normales
async getAll(): Promise<Attendance[]> {
return await this.attendanceRepository.findAll();
}

async getAttendanceById(id: string): Promise<Attendance> {
const attendance = await this.attendanceRepository.findById(id);
if (!attendance) {
throw new NotFoundError(`Asistencia con el id ${id} no encontrada`);
}
return attendance;
}

// ✅ Métodos que SÍ necesitan transacciones - usan UoW
async createAttendance(data: CreateAttendanceDto): Promise<Attendance> {
// Validaciones ANTES de la transacción
const employee = await this.employeeRepository.findById(data.employeeId);
if (!employee) {
throw new ValidationError(
`El empleado con la ID ${data.employeeId} no ha sido encontrado`
);
}

    if (!Array.isArray(data.attendancePeriods)) {
      throw new ValidationError(
        "Los periodos de la asistencia debe ser un array"
      );
    }

    // ✅ Usar Unit of Work para operaciones transaccionales
    return this.unitOfWork.executeTransaction(async (uow) => {
      // Dentro de la transacción, usar los repos del UoW
      return uow.attendanceRepository.create(data);
    });

}

async updateAttendance(id: string, data: UpdateAttendanceDto): Promise<Attendance> {
// Validación ANTES de la transacción
const attendance = await this.getAttendanceById(id);

    // ✅ Si la actualización es simple, puede que no necesites transacción
    return await this.attendanceRepository.update(attendance, data);

    // ✅ Si es compleja y afecta múltiples entidades:
    // return this.unitOfWork.executeTransaction(async (uow) => {
    //   return uow.attendanceRepository.update(attendance, data);
    // });

}

async deleteAttendanceWithAttendancePeriods(id: string): Promise<void> {
// Validaciones ANTES de la transacción
const attendance = await this.getAttendanceById(id);
const periods = await attendance.attendancePeriods.init();

    if (periods.length == 0) {
      await this.attendanceRepository.delete(attendance);
      return;
    }

    const alreadyCheck = periods
      .getItems()
      .find((ap) => ap.status !== PERIOD_STATUS.PENDING);

    if (alreadyCheck) {
      throw new ValidationError("No se puede eliminar ya se encuentra en uso");
    }

    // ✅ Usar Unit of Work para eliminación transaccional
    return this.unitOfWork.executeTransaction(async (uow) => {
      await uow.attendanceRepository.delete(attendance);
    });

}
}

// ===== PASO 4: Configurar en las rutas =====
// En tu archivo de rutas, necesitas crear el UoW
function withAttendanceController(
handler: (
controller: AttendanceController,
req: Request,
res: Response,
next: NextFunction
) => any
) {
return (req: Request, res: Response, next: NextFunction) => {
const em = (req as any).em as SqlEntityManager;

    // Crear repositorios
    const employeeRepository = new EmployeeRepositoryImpl(em);
    const attendancePeriodRepository = new AttendancePeriodRepositoryImpl(em);
    const attendanceRepository = new AttendanceRepositoryImpl(em, attendancePeriodRepository);

    // ✅ Crear Unit of Work
    const unitOfWork = new UnitOfWork(em);

    // Crear servicio con UoW
    const attendanceService = new AttendanceService(
      attendanceRepository,
      employeeRepository,
      unitOfWork
    );

    const attendanceController = new AttendanceController(attendanceService);
    return handler(attendanceController, req, res, next);

};
}

// ===== EJEMPLO DE USO COMPLEJO =====
// Imagina que quieres crear una asistencia Y actualizar el empleado Y crear un log
async createAttendanceWithEmployeeUpdate(data: CreateAttendanceDto): Promise<Attendance> {
return this.unitOfWork.executeTransaction(async (uow) => {
// ✅ Todos estos repos usan la MISMA conexión transaccional

    // 1. Crear asistencia
    const attendance = await uow.attendanceRepository.create(data);

    // 2. Actualizar último check-in del empleado
    const employee = await uow.employeeRepository.findById(data.employeeId);
    await uow.employeeRepository.update(employee, { lastCheckIn: new Date() });

    // 3. Crear log de auditoría
    // await uow.auditLogRepository.create({
    //   action: 'ATTENDANCE_CREATED',
    //   entityId: attendance.id,
    //   userId: data.createdBy
    // });

    // Si CUALQUIERA de estas operaciones falla, TODO se deshace
    return attendance;

});
}
# mario-ecomerce
