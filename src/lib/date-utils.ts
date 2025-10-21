/**
 * Date utilities for handling Botswana timezone (CAT - UTC+2)
 */

// Botswana timezone identifier
export const BOTSWANA_TIMEZONE = 'Africa/Gaborone'

/**
 * Format a UTC timestamp to Botswana local time
 * @param utcTimestamp - ISO string or Date object from the database
 * @param options - Intl.DateTimeFormatOptions for customization
 * @returns Formatted date string in Botswana timezone
 */
export function formatToBotswanaTime(
  utcTimestamp: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }
): string {
  const date =
    typeof utcTimestamp === 'string' ? new Date(utcTimestamp) : utcTimestamp

  return new Intl.DateTimeFormat('en-GB', {
    ...options,
    timeZone: BOTSWANA_TIMEZONE,
  }).format(date)
}

/**
 * Format a UTC timestamp to Botswana local time with a more readable format
 * @param utcTimestamp - ISO string or Date object from the database
 * @returns Formatted date string like "21/10/2025, 02:45:44"
 */
export function formatToBotswanaDateTime(utcTimestamp: string | Date): string {
  return formatToBotswanaTime(utcTimestamp, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

/**
 * Format a UTC timestamp to Botswana local time for display in lists
 * @param utcTimestamp - ISO string or Date object from the database
 * @returns Formatted date string like "21/10/2025, 02:45"
 */
export function formatToBotswanaDateTimeShort(
  utcTimestamp: string | Date
): string {
  return formatToBotswanaTime(utcTimestamp, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

/**
 * Get the current time in Botswana timezone
 * @returns Current date/time in Botswana timezone
 */
export function getBotswanaTime(): Date {
  const now = new Date()
  return new Date(now.toLocaleString('en-US', { timeZone: BOTSWANA_TIMEZONE }))
}

/**
 * Convert a Botswana local time to UTC for sending to the server
 * @param botswanaTime - Date object in Botswana timezone
 * @returns Date object in UTC
 */
export function botswanaTimeToUTC(botswanaTime: Date): Date {
  // Get the timezone offset for Botswana
  const botswanaOffset = 2 * 60 // UTC+2 in minutes
  const utcTime = new Date(botswanaTime.getTime() - botswanaOffset * 60 * 1000)
  return utcTime
}

/**
 * Format relative time (e.g., "2 hours ago") in Botswana timezone
 * @param utcTimestamp - ISO string or Date object from the database
 * @returns Relative time string
 */
export function formatRelativeTime(utcTimestamp: string | Date): string {
  const date =
    typeof utcTimestamp === 'string' ? new Date(utcTimestamp) : utcTimestamp
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

  // For older dates, show the actual date in Botswana timezone
  return formatToBotswanaDateTimeShort(date)
}
