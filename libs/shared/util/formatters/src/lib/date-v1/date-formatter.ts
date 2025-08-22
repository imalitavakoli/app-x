export type V1FormattersDate_DateFormat =
  | 'YYYY-MM-DD'
  | 'DD-MMM-YYYY'
  | 'DD-MM-YYYY'
  | 'MM-DD-YYYY'
  | 'HH:mm:ss'
  | 'h:mm:ss a'
  | 'dddd, D MMMM';

/**
 * Format date & time based on the given format and locale.
 * Examples of the accepted `str` format:
 * - '2022-05-01'
 * - '2022-05-01T00:00:00'
 * - '2022-05-01T00:00:00.000Z'
 *
 * @export
 * @param {string} str
 * @param {V1FormattersDate_DateFormat} format
 * @param {Intl.Locale} locale
 * @returns {string}
 */
export function v1DateFormat(
  str: string,
  format: V1FormattersDate_DateFormat,
  locale: Intl.LocalesArgument = 'en-GB',
): string {
  const origDate = new Date(str);
  const options: Intl.DateTimeFormatOptions = {};

  // Define options based on the `format`.
  switch (format) {
    case 'YYYY-MM-DD':
      options.year = 'numeric';
      options.month = '2-digit';
      options.day = '2-digit';
      return origDate.toLocaleDateString(locale, options);
    case 'DD-MMM-YYYY':
      options.day = '2-digit';
      options.month = 'short';
      options.year = 'numeric';
      return origDate.toLocaleDateString(locale, options);
    case 'DD-MM-YYYY':
      options.day = '2-digit';
      options.month = '2-digit';
      options.year = 'numeric';
      return origDate.toLocaleDateString(locale, options);
    case 'MM-DD-YYYY':
      options.month = '2-digit';
      options.day = '2-digit';
      options.year = 'numeric';
      return origDate.toLocaleDateString(locale, options);
    case 'HH:mm:ss':
      options.hour = '2-digit';
      options.minute = '2-digit';
      options.second = '2-digit';
      return origDate.toLocaleTimeString(locale, options);
    case 'h:mm:ss a':
      options.hour = 'numeric';
      options.minute = '2-digit';
      options.second = '2-digit';
      options.hour12 = true;
      return origDate.toLocaleTimeString(locale, options);
    case 'dddd, D MMMM': {
      const weekday = origDate.toLocaleDateString(locale, { weekday: 'long' });
      const dayMonth = origDate.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
      });
      return `${weekday}, ${dayMonth}`;
    }
  }
}

/**
 * Convert date & time based on local time zone to string in ISO format.
 *
 * NOTE: The original JS `toISOString` method converts the date to UTC
 * (Coordinated Universal Time), which might cause the date to appear offset if
 * your local time zone is different.
 *
 * @example
 * v1DateFormatLocalDateToISO(new Date('2023-06-01T00:00:00')); // '2023-06-01T00:00:00'
 *
 * @export
 * @param {Date} date
 * @returns {string}
 */
export function v1DateFormatLocalDateToISO(date: Date): string {
  const pad = (number: number): string => {
    return number < 10 ? '0' + number : number.toString();
  };

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Months are zero-indexed
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Date & time Utils                                                          */
/* ////////////////////////////////////////////////////////////////////////// */

export type V1FormattersDate_FirstDayOfWeek = 'Sunday' | 'Monday' | 'Saturday';

export type V1FormattersDate_DatesDiff = {
  status: 'same' | 'ahead' | 'earlier';
  difference: number;
};

/* Are periods are the same ///////////////////////////////////////////////// */

/** Helper functions to check if two dates are the same year. */
export function v1DateIsSameYear(tdate1: Date, tdate2: Date) {
  return tdate1.getFullYear() === tdate2.getFullYear();
}

/** Helper functions to check if two dates are the same quarter. */
export function v1DateIsSameQuarter(tdate1: Date, tdate2: Date) {
  const getQuarter = (tdate: Date): number => {
    const month = tdate.getMonth();
    return Math.floor(month / 3) + 1; // Q1: 0-2, Q2: 3-5, Q3: 6-8, Q4: 9-11
  };
  return (
    tdate1.getFullYear() === tdate2.getFullYear() &&
    getQuarter(tdate1) === getQuarter(tdate2)
  );
}

/** Helper functions to check if two dates are the same month. */
export function v1DateIsSameMonth(tdate1: Date, tdate2: Date) {
  return (
    tdate1.getFullYear() === tdate2.getFullYear() &&
    tdate1.getMonth() === tdate2.getMonth()
  );
}

/** Helper functions to check if two dates are the same week. */
export function v1DateIsSameWeek(
  tdate1: Date,
  tdate2: Date,
  tfirstDayOfWeek: V1FormattersDate_FirstDayOfWeek,
) {
  const getWeekNumber = (
    tdate: Date,
    startOfWeek: V1FormattersDate_FirstDayOfWeek,
  ): number => {
    const daysInWeek = {
      Sunday: 0,
      Monday: 1,
      Saturday: 6,
    };
    const startOfYear = new Date(tdate.getFullYear(), 0, 1);
    const days = Math.floor(
      (tdate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24),
    );
    // Adjust days based on the start of the week
    const startDay = daysInWeek[startOfWeek];
    const adjustedDays = days + ((startOfYear.getDay() - startDay + 7) % 7);
    // Calculate the week number
    return Math.ceil((adjustedDays + 1) / 7);
  };
  return (
    tdate1.getFullYear() === tdate2.getFullYear() &&
    getWeekNumber(tdate1, tfirstDayOfWeek) ===
      getWeekNumber(tdate2, tfirstDayOfWeek)
  );
}

/** Helper functions to check if two dates are the same day. */
export function v1DateIsSameDay(tdate1: Date, tdate2: Date) {
  return (
    tdate1.getFullYear() === tdate2.getFullYear() &&
    tdate1.getMonth() === tdate2.getMonth() &&
    tdate1.getDate() === tdate2.getDate()
  );
}

/* Compare periods ////////////////////////////////////////////////////////// */

/**
 * Compare two dates and return the status and the difference in years.
 *
 * @example
 * const dateA = new Date('2024-02-01T00:00:00');
 * const dateB = new Date('2026-07-15T14:40:05');
 * v1DateCompareYears(dateA, dateB); // { status: "ahead", difference: 2 }
 *
 * @export
 * @param {Date} baseDate
 * @param {Date} date
 * @returns {V1FormattersDate_DatesDiff}
 */
export function v1DateCompareYears(
  baseDate: Date,
  date: Date,
): V1FormattersDate_DatesDiff {
  const difference = date.getFullYear() - baseDate.getFullYear();

  if (difference > 0) {
    return { status: 'ahead', difference };
  } else if (difference < 0) {
    return { status: 'earlier', difference: Math.abs(difference) };
  } else {
    return { status: 'same', difference: 0 };
  }
}

/**
 * Compare two dates and return the status and the difference in quarters.
 *
 * @example
 * const dateA = new Date('2024-02-01T00:00:00'); // Q1
 * const dateB = new Date('2024-07-15T14:40:05'); // Q3
 * v1DateCompareQuarters(dateA, dateB); // { status: "ahead", difference: 2 }
 *
 * @export
 * @param {Date} baseDate
 * @param {Date} date
 * @returns {V1FormattersDate_DatesDiff}
 */
export function v1DateCompareQuarters(
  baseDate: Date,
  date: Date,
): V1FormattersDate_DatesDiff {
  const getQuarter = (tdate: Date): number =>
    Math.floor(tdate.getMonth() / 3) + 1;

  const yearDiff = date.getFullYear() - baseDate.getFullYear();
  const quarterDiff = getQuarter(date) - getQuarter(baseDate);
  const totalQuarterDiff = yearDiff * 4 + quarterDiff;

  if (totalQuarterDiff > 0) {
    return { status: 'ahead', difference: totalQuarterDiff };
  } else if (totalQuarterDiff < 0) {
    return { status: 'earlier', difference: Math.abs(totalQuarterDiff) };
  } else {
    return { status: 'same', difference: 0 };
  }
}

/**
 * Compare two dates and return the status and the difference in months.
 *
 * @example
 * const dateA = new Date('2024-02-01T00:00:00'); // February 2024
 * const dateB = new Date('2024-07-15T14:40:05'); // July 2024
 * v1DateCompareMonths(dateA, dateB); // { status: "ahead", difference: 5 }
 *
 * @export
 * @param {Date} baseDate
 * @param {Date} date
 * @returns {V1FormattersDate_DatesDiff}
 */
export function v1DateCompareMonths(
  baseDate: Date,
  date: Date,
): V1FormattersDate_DatesDiff {
  const yearDiff = date.getFullYear() - baseDate.getFullYear();
  const monthDiff = date.getMonth() - baseDate.getMonth();
  const totalMonthDiff = yearDiff * 12 + monthDiff;

  if (totalMonthDiff > 0) {
    return { status: 'ahead', difference: totalMonthDiff };
  } else if (totalMonthDiff < 0) {
    return { status: 'earlier', difference: Math.abs(totalMonthDiff) };
  } else {
    return { status: 'same', difference: 0 };
  }
}

/**
 * Compare two dates and return the status and the difference in weeks.
 *
 * @example
 * const dateA = new Date('2024-02-01T00:00:00'); // A date in 2024
 * const dateB = new Date('2024-03-15T14:40:05'); // A later date in 2024
 * v1DateCompareWeeks(dateA, dateB, 'Monday'); // { status: "ahead", difference: X }
 *
 * @export
 * @param {Date} baseDate
 * @param {Date} date
 * @param {V1FormattersDate_FirstDayOfWeek} tfirstDayOfWeek
 * @returns {V1FormattersDate_DatesDiff}
 */
export function v1DateCompareWeeks(
  baseDate: Date,
  date: Date,
  tfirstDayOfWeek: V1FormattersDate_FirstDayOfWeek,
): V1FormattersDate_DatesDiff {
  const getWeekNumber = (
    tdate: Date,
    startOfWeek: V1FormattersDate_FirstDayOfWeek,
  ): number => {
    const daysInWeek = { Sunday: 0, Monday: 1, Saturday: 6 };
    const startOfYear = new Date(tdate.getFullYear(), 0, 1);
    const days = Math.floor(
      (tdate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24),
    );
    const startDay = daysInWeek[startOfWeek];
    const adjustedDays = days + ((startOfYear.getDay() - startDay + 7) % 7);
    return Math.ceil((adjustedDays + 1) / 7);
  };

  const yearDiff = date.getFullYear() - baseDate.getFullYear();
  const weekDiff =
    getWeekNumber(date, tfirstDayOfWeek) -
    getWeekNumber(baseDate, tfirstDayOfWeek);
  const totalWeekDiff = yearDiff * 52 + weekDiff;

  if (totalWeekDiff > 0) {
    return { status: 'ahead', difference: totalWeekDiff };
  } else if (totalWeekDiff < 0) {
    return { status: 'earlier', difference: Math.abs(totalWeekDiff) };
  } else {
    return { status: 'same', difference: 0 };
  }
}

/**
 * Compare two dates and return the status and the difference in days.
 *
 * @example
 * const dateA = new Date('2024-02-01T00:00:00'); // February 1, 2024
 * const dateB = new Date('2024-02-10T14:40:05'); // February 10, 2024
 * v1DateCompareDays(dateA, dateB); // { status: "ahead", difference: 9 }
 *
 * @export
 * @param {Date} baseDate
 * @param {Date} date
 * @returns {V1FormattersDate_DatesDiff}
 */
export function v1DateCompareDays(
  baseDate: Date,
  date: Date,
): V1FormattersDate_DatesDiff {
  // Convert both dates to UTC midnight to avoid time zone inconsistencies
  const date1 = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
  );
  const date2 = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // Calculate the difference in days
  const oneDayMs = 1000 * 60 * 60 * 24;
  const diff = Math.floor((date2.getTime() - date1.getTime()) / oneDayMs);

  if (diff > 0) {
    return { status: 'ahead', difference: diff };
  } else if (diff < 0) {
    return { status: 'earlier', difference: Math.abs(diff) };
  } else {
    return { status: 'same', difference: 0 };
  }
}

/* Get period difference //////////////////////////////////////////////////// */

/**
 * Get the difference between two dates and return the period.
 *
 * @example
 * v1DateGetDifference("2025-02-17T00:00:00", "2025-02-10T00:00:00")); // "week"
 *
 * @export
 * @param {Date} d1
 * @param {Date} d2
 * @returns {("week" | "month" | "quarter" | "year" | "year+")}
 */
export function v1DateGetDifference(
  date1: Date,
  date2: Date,
): 'week' | 'month' | 'quarter' | 'year' | 'year+' {
  const diffTime = Math.abs(date1.getTime() - date2.getTime());
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays <= 7) {
    return 'week';
  } else if (diffDays <= 31) {
    return 'month';
  } else if (diffDays <= 92) {
    // Approximate days in a quarter
    return 'quarter';
  } else if (diffDays <= 365) {
    return 'year';
  } else {
    return 'year+';
  }
}
