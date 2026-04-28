/**
 * Lightweight utility helpers used across the app.
 */

/** Generate a short random id – mirrors the pattern already in use. */
export const generateId = (): string =>
  Math.random().toString(36).substring(2, 11);

/** Format a date string to a human-readable format (e.g. "20 May 2024") */
export const formatDate = (dateStr: string): string => {
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

/** Build a CSV string from an array of objects. */
export const toCSV = <T extends Record<string, unknown>>(rows: T[]): string => {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const lines = rows.map((r) =>
    headers.map((h) => String(r[h] ?? '')).join(',')
  );
  return [headers.join(','), ...lines].join('\n');
};

/** Trigger a CSV download in the browser. */
export const downloadCSV = (csv: string, filename: string): void => {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  a.click();
  URL.revokeObjectURL(url);
};
