/**
 * Indian Standard Time (IST, GMT+5:30) Date & Countdown Utilities
 * Ensures consistent time calculation across any VPS/server location and client browsers.
 */

// IST is UTC + 5 hours 30 minutes
export const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

/**
 * Normalizes any date input into a reliable epoch timestamp.
 * If a datetime-local string (e.g. "2026-10-16T18:30") lacks timezone offset,
 * it assumes the date is set in IST (Asia/Kolkata).
 */
export function getISTTimestamp(dateInput) {
  if (!dateInput) return null;

  if (typeof dateInput === 'string') {
    // If string has no timezone indicator (no Z and no +/- offset), treat as IST
    if (!dateInput.includes('Z') && !/[+-]\d{2}:?\d{2}$/.test(dateInput)) {
      // Append +05:30 so Date.parse parses it in IST regardless of local machine/VPS timezone
      const formatted = dateInput.length === 16 ? `${dateInput}:00+05:30` : `${dateInput}+05:30`;
      const parsed = Date.parse(formatted);
      if (!isNaN(parsed)) return parsed;
    }
  }

  const d = new Date(dateInput);
  const time = d.getTime();
  return isNaN(time) ? null : time;
}

/**
 * Calculates remaining hours, minutes, seconds between now and target date in IST.
 */
export function calculateRemainingTime(endDateInput) {
  const targetMs = getISTTimestamp(endDateInput);
  if (!targetMs) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, totalSeconds: 0 };
  }

  const nowMs = Date.now();
  const diffMs = targetMs - nowMs;

  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, totalSeconds: 0 };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, isExpired: false, totalSeconds };
}

/**
 * Formats date into readable IST format (e.g. "16 Oct 2026, 06:30 PM IST")
 */
export function formatISTDate(dateInput, includeTime = true) {
  const timestamp = getISTTimestamp(dateInput);
  if (!timestamp) return '';

  const options = {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit', hour12: true } : {})
  };

  const formatted = new Intl.DateTimeFormat('en-IN', options).format(new Date(timestamp));
  return includeTime ? `${formatted} IST` : formatted;
}
