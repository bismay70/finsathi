import { addDays, addMonths, addWeeks, addYears, startOfMonth } from "date-fns";
import { TransactionRecurringIntervalEnum } from "../types";

export function calulateNextReportDate(lastSentDate?: Date): Date {
  const now = new Date();
  const lastSent = lastSentDate || now;

  const nextDate = startOfMonth(addMonths(lastSent, 1));
  nextDate.setHours(0, 0, 0, 0);

  console.log(nextDate, "nextDate");
  return nextDate;
}

export function calculateNextOccurrence(
  date: Date,
  recurringInterval: TransactionRecurringIntervalEnum | keyof typeof TransactionRecurringIntervalEnum | null
) {
  const base = new Date(date);
  base.setHours(0, 0, 0, 0);

  switch (recurringInterval) {
    case TransactionRecurringIntervalEnum.DAILY:
      return addDays(base, 1);
    case TransactionRecurringIntervalEnum.WEEKLY:
      return addWeeks(base, 1);
    case TransactionRecurringIntervalEnum.MONTHLY:
      return addMonths(base, 1);
    case TransactionRecurringIntervalEnum.YEARLY:
      return addYears(base, 1);
    default:
      return base;
  }
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
