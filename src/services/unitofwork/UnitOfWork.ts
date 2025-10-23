import { EntityManager } from "@mikro-orm/postgresql";

import { AttendanceRepositoryImpl } from "../../repositories/Attendance/AttendanceRepositoryImpl";
import { AttendancePeriodRepositoryImpl } from "../../repositories/AttendancePeriod/AttendancePeriodRepositoryImpl";
import { EmployeeRepositoryImpl } from "../../repositories/Employee/EmployeeRepositoryImpl";
import { PermissionRepositoryImpl } from "../../repositories/Permission/PermissionRepositoryImpl";
import { PermissionShiftCompesationRepositoryImpl } from "../../repositories/PermissionShiftCompensation/PermissionShiftCompesationRepositoryImpl";
import { PermissionTimeRageRepositoryImpl } from "../../repositories/PermissionTimeRange/PermissionTimeRangeRepositoryImpl";
import { ShiftRepositoryImpl } from "../../repositories/Shift/ShiftRepositoryImpl";
import { DailyShiftRepositoryImpl } from "../../repositories/DailyShift/DailyShiftRepositoryImpl";
import { WorkPeriodRepositoryImpl } from "../../repositories/WorkPeriod/WorkPeriodRepositoryImpl";
import { OvertimeRepositoryImpl } from "../../repositories/Overtime/OvertimeRepositoryImpl";
import { CheckRepositoryImpl } from "../../repositories/CheckSystem/CheckSystemRepositoryImpl";
import { EmployeeShiftRepositoryImpl } from "../../repositories/EmployeeShift/EmployeeShiftRepositoryImpl";

export class UnitOfWork {
  constructor(private readonly em: EntityManager) {}

  // Repositorios transaccionales
  get attendanceRepository() {
    return new AttendanceRepositoryImpl(this.em);
  }

  get attendancePeriodRepository() {
    return new AttendancePeriodRepositoryImpl(this.em);
  }

  get employeeRepository() {
    return new EmployeeRepositoryImpl(this.em);
  }

  get employeeShiftRepository() {
    return new EmployeeShiftRepositoryImpl(this.em);
  }

  get permissionRepository() {
    return new PermissionRepositoryImpl(this.em);
  }

  get permissionShiftCompensantionRepo() {
    return new PermissionShiftCompesationRepositoryImpl(this.em);
  }

  get permissionTimeRange() {
    return new PermissionTimeRageRepositoryImpl(this.em);
  }

  get shiftRepository() {
    return new ShiftRepositoryImpl(this.em);
  }

  get dailyShiftRepository() {
    return new DailyShiftRepositoryImpl(this.em);
  }

  get workPeriodRepository() {
    return new WorkPeriodRepositoryImpl(this.em);
  }

  get overtimeRepository() {
    return new OvertimeRepositoryImpl(this.em);
  }

  get checkSystemRepository() {
    return new CheckRepositoryImpl(this.em);
  }

  async executeTransaction<T>(
    operation: (uow: UnitOfWork) => Promise<T>
  ): Promise<T> {
    return this.em.transactional(async (transactionalEm) => {
      const transactionalUoW = new UnitOfWork(transactionalEm);
      return operation(transactionalUoW);
    });
  }
}
