// ============================================================
// Format Utilities
// ============================================================

/**
 * Format price in Israeli Shekels
 */
export function formatPrice(price: number): string {
  return `₪${price.toFixed(2)}`;
}

const getLocale = (language: 'he' | 'en' = 'he'): string =>
  language === 'he' ? 'he-IL' : 'en-US';

/**
 * Format price with unit
 */
export function formatPriceWithUnit(price: number, unit: string): string {
  return `₪${price.toFixed(2)} / ${unit}`;
}

/**
 * Format date to Hebrew-friendly string
 */
export function formatDate(dateStr: string, language: 'he' | 'en' = 'he'): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(getLocale(language), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date with time
 */
export function formatDateTime(dateStr: string, language: 'he' | 'en' = 'he'): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(getLocale(language), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format relative time in Hebrew
 */
export function formatRelativeTime(dateStr: string, language: 'he' | 'en' = 'he'): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (language === 'en') {
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    return formatDate(dateStr, language);
  }

  if (diffMins < 1) return 'עכשיו';
  if (diffMins < 60) return `לפני ${diffMins} דקות`;
  if (diffHours < 24) return `לפני ${diffHours} שעות`;
  if (diffDays < 7) return `לפני ${diffDays} ימים`;
  return formatDate(dateStr, language);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Format order number (short readable ID)
 */
export function formatOrderNumber(id: string): string {
  return `#${id.slice(0, 8).toUpperCase()}`;
}
