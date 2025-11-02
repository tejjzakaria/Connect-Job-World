import { formatDistanceToNow, Locale } from "date-fns";
import { ar, fr, enUS } from "date-fns/locale";
import i18next from "i18next";

/**
 * Date formatting utilities that support multiple languages
 * Formats dates based on the current i18n language selection
 */

// Locale configuration for Arabic with Latin numerals
const LOCALE_AR_LATIN = "ar-EG-u-nu-latn";

/**
 * Get the current locale string based on i18n language
 */
function getCurrentLocale(): string {
  const currentLang = i18next.language;
  switch (currentLang) {
    case "ar":
      return LOCALE_AR_LATIN;
    case "fr":
      return "fr-FR";
    case "en":
      return "en-US";
    default:
      return LOCALE_AR_LATIN;
  }
}

/**
 * Get the date-fns locale object based on i18n language
 */
function getDateFnsLocale(): Locale {
  const currentLang = i18next.language;
  switch (currentLang) {
    case "ar":
      return ar;
    case "fr":
      return fr;
    case "en":
      return enUS;
    default:
      return ar;
  }
}

/**
 * Format a date as a localized date string (e.g., "15 يناير 2024" for Arabic, "15 janvier 2024" for French)
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
    return dateObj.toLocaleDateString(getCurrentLocale(), options);
  } catch (error) {
    return "-";
  }
}

/**
 * Format a date with time (e.g., "15 يناير 2024، 14:30" for Arabic, "15 janvier 2024 à 14:30" for French)
 */
export function formatDateTime(date: Date | string): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleString(getCurrentLocale(), {
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
 * Format a date as a short date string (e.g., "15/1/2024" for ar/en, "15/01/2024" for fr)
 */
export function formatShortDate(date: Date | string): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString(getCurrentLocale());
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
    return dateObj.toLocaleTimeString(getCurrentLocale(), {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return "-";
  }
}

/**
 * Format a date with full date and time (e.g., "15 يناير 2024 الساعة 14:30" for Arabic)
 */
export function formatFullDateTime(date: Date | string): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleString(getCurrentLocale(), {
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
 * Format relative time (e.g., "منذ ساعتين" for Arabic, "il y a 2 heures" for French, "2 hours ago" for English)
 * Uses date-fns for natural language relative time formatting
 */
export function formatRelativeTime(date: Date | string): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return formatDistanceToNow(dateObj, {
      addSuffix: true,
      locale: getDateFnsLocale(),
    });
  } catch (error) {
    return "";
  }
}

/**
 * Format date for CSV exports (uses current locale)
 */
export function formatDateForExport(date: Date | string): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleString(getCurrentLocale());
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
 * Format numbers according to current locale
 */
export function formatNumber(num: number): string {
  return num.toLocaleString(getCurrentLocale());
}
