const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const MINUTES_IN_DAY = HOURS_IN_DAY * MINUTES_IN_HOUR;

/**
 * Calculates the number of hours between two time strings (HH:MM format)
 * Handles overnight shifts (when end time is before start time)
 */
export function calculateHours(start: string, end: string): number {
  if (!start || !end) return 0;

  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  const startMinutes = startHour * MINUTES_IN_HOUR + startMinute;
  const endMinutes = endHour * MINUTES_IN_HOUR + endMinute;

  let diffMinutes = endMinutes - startMinutes;

  // Handle overnight shifts (e.g., 22:00 to 06:00)
  if (diffMinutes < 0) {
    diffMinutes += MINUTES_IN_DAY;
  }

  return diffMinutes / MINUTES_IN_HOUR;
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
