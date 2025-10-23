import dotenv from "dotenv";
dotenv.config();

export const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
export const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
export const NODE_ENV = process.env.NODE_ENV
  ? process.env.NODE_ENV
  : "production";

export const EARLY_CLOCKIN_MIN = parseInt(
  process.env.EARLY_CLOCKIN_MIN ?? "15"
);

export const FACTORY_ON = process.env.FACTORY_ON == "true" ? true : false;

export const DB_CONFIG = {
  dbName: process.env.DB_NAME || "test",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "sparksx",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  debug: NODE_ENV == "production" ? false : true,
};

export enum ATTENDANCE_STATUS {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LATE = "LATE",
  JUSTIFIED = "JUSTIFIED",
  PENDING = "PENDING",
  VACATION = "VACATION",
  HOLIDAY = "HOLIDAY",
  PARTIAL = "PARTIAL",
}

export enum ATTENDANCE_ORIGIN {
  REGULAR = "REGULAR",
  PERMISSION_DAY = "PERMISSION_DAY",
  PERMISSION_COMPENSATION = "PERMISSION_COMPENSATION",
  VACATION = "VACATION",
  HOLIDAY = "HOLIDAY",
  REST_DAY = "REST_DAY",
  DOUBLE_SHIFT = "DOUBLE_SHIFT",
  WORKED_HOLIDAY = "WORKED_HOLIDAY",
  //TODO: Checar esto ya despues
  WORKED_VACATION = "WORKED_VACATION",
  WORKED_VACATION_COMPENSATION = "WORKED_VACATION_COMPENSATION",
}

export enum PERIOD_STATUS {
  PENDING = "PENDING",
  CHECKED_IN = "CHECKED_IN",
  ON_BREAK = "ON_BREAK",
  BACK_FROM_BREAK = "BACK_FROM_BREAK",
  CHECKED_OUT = "CHECKED_OUT",
  MISSED = "MISSED",
}

export enum PERMISSION_TYPE {
  FULL_DAY = "FULL_DAY",
  PARTIAL_SCHEDULE_CHANGE = "PARTIAL_SCHEDULE_CHANGE",
}

export enum COMPENSATION_STATUS {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum TIME_RANGE_TYPE {
  ORIGINAL_SCHEDULE = "ORIGINAL_SCHEDULE",
  MODIFIED_SCHEDULE = "MODIFIED_SCHEDULE",
}

export enum PAYMENT_STATUS {
  PENDING = "PENDING",
  PAID = "PAID",
}

export enum OVERTIME_TYPE {
  SIMPLE = "SIMPLE",
  DOUBLE = "DOUBLE",
  TRIPLE = "TRIPLE",
}

export enum AUTHORIZATION_STATUS {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}
