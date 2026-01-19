import { isSameDay } from "date-fns";

/**
 * Checks if two dates are on the same day
 */
export function isSameDayDate(date1: Date, date2: Date): boolean {
  return isSameDay(date1, date2);
}

/**
 * Gets all sessions that belong to a specific day
 */
export function getSessionsForDay<T extends { dateObj: Date }>(
  sessions: T[],
  targetDate: Date
): T[] {
  return sessions.filter((session) =>
    isSameDayDate(new Date(session.dateObj), targetDate)
  );
}

/**
 * Checks if a date is today
 */
export function isToday(date: Date): boolean {
  return isSameDayDate(date, new Date());
}
