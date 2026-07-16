export enum TransactionTypeEnum {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export enum TransactionRecurringIntervalEnum {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export enum PaymentMethodEnum {
  CASH = "CASH",
  CARD = "CARD",
  BANK_TRANSFER = "BANK_TRANSFER",
  MOBILE_PAYMENT = "MOBILE_PAYMENT",
  AUTO_DEBIT = "AUTO_DEBIT",
  OTHER = "OTHER",
}

export enum ReportFrequencyEnum {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export enum ReportStatusEnum {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SENT = "SENT",
  FAILED = "FAILED",
  NO_ACTIVITY = "NO_ACTIVITY"
}
