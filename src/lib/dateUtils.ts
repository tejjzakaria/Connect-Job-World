import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

/**
 * Date formatting utilities that use Arabic locale with Latin numerals
 * This ensures dates display in Arabic format but with Western numbers (0-9)
 */

// Locale configuration for Arabic with Latin numerals
const LOCALE_AR_LATIN = "ar-EG-u-nu-latn";

/**
 * Format a date as a localized date string (e.g., "١٥ يناير ٢٠٢٤" → "15 يناير 2024")
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString(LOCALE_AR_LATIN, options);
  } catch (error) {
    return "-";
  }
}

/**
 * Format a date with time (e.g., "15 يناير 2024، 14:30")
 */
export function formatDateTime(date: Date | string): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleString(LOCALE_AR_LATIN, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return "-";
  }
}

/**
 * Format a date as a short date string (e.g., "15/1/2024")
 */
export function formatShortDate(date: Date | string): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString(LOCALE_AR_LATIN);
  } catch (error) {
    return "-";
  }
}

/**
 * Format a time string (e.g., "14:30")
 */
export function formatTime(date: Date | string): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleTimeString(LOCALE_AR_LATIN, {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return "-";
  }
}

/**
 * Format a date with full date and time (e.g., "15 يناير 2024 الساعة 14:30")
 */
export function formatFullDateTime(date: Date | string): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const dateStr = dateObj.toLocaleDateString(LOCALE_AR_LATIN, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timeStr = dateObj.toLocaleTimeString(LOCALE_AR_LATIN, {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${dateStr} الساعة ${timeStr}`;
  } catch (error) {
    return "-";
  }
}

/**
 * Format relative time (e.g., "منذ ساعتين")
 * Note: date-fns uses its own formatting which may include Arabic numerals
 * This is wrapped for consistency
 */
export function formatRelativeTime(date: Date | string): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return formatDistanceToNow(dateObj, {
      addSuffix: true,
      locale: ar,
    });
  } catch (error) {
    return "";
  }
}

/**
 * Format date for CSV exports (short format with Latin numerals)
 */
export function formatDateForExport(date: Date | string): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleString(LOCALE_AR_LATIN);
  } catch (error) {
    return "";
  }
}

/**
 * Format date for filenames (ISO format: YYYY-MM-DD)
 */
export function formatDateForFilename(date: Date = new Date()): string {
  return date.toISOString().split("T")[0];
}

/**
 * Format numbers with Arabic locale but Latin numerals
 */
export function formatNumber(num: number): string {
  return num.toLocaleString(LOCALE_AR_LATIN);
}
