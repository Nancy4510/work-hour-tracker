const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const MINUTES_IN_DAY = HOURS_IN_DAY * MINUTES_IN_HOUR;

/**
 * Calculates the number of hours between two time strings (HH:MM format)
 * Handles overnight shifts (when end time is before start time)
 */

export function calculateHours(start: string, end: string): number {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  if ([sh, sm, eh, em].some(Number.isNaN)) return 0;

  const startMinutes = sh * MINUTES_IN_HOUR + sm;
  const endMinutes = eh * MINUTES_IN_HOUR + em;
  let diff = endMinutes - startMinutes;
  // Handle overnight shifts (e.g., 22:00 to 06:00)
  if (diff < 0) diff += MINUTES_IN_DAY; // overnight
  return diff / MINUTES_IN_HOUR;
}

/**
 * Formats a 24-hour time string (HH:MM) to 12-hour format with AM/PM
 * @param time - Time string in HH:MM format (e.g., "14:30", "09:00")
 * @returns Formatted time string (e.g., "2:30 PM", "9:00 AM")
 */
export function formatTimeAMPM(time: string): string {
  if (!time) return "";

  const [hours, minutes] = time.split(":").map(Number);

  // Handle invalid input
  if (isNaN(hours) || isNaN(minutes)) return time;

  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

/**
 * Formats decimal hours (e.g. 8.67) as "8h:40m".
 * Rounds to the nearest minute to avoid floating-point drift.
 */
export function formatHoursMinutes(decimalHours: number): string {
  const totalMinutes = Math.round(decimalHours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h:${m.toString().padStart(2, "0")}m`;
}
