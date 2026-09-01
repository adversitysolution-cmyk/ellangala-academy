// Turns an event's start/end date into the human phrase used on certificates.
// The event stays the source of truth — the host never types these.

// Accepts a Date, an ISO date (2026-08-18) or DD-MM-YYYY and returns DD-MM-YYYY.
export function formatCertDate(value) {
  if (!value) return '';
  let d, m, y;
  if (value instanceof Date) {
    [d, m, y] = [value.getDate(), value.getMonth() + 1, value.getFullYear()];
  } else {
    const s = String(value).trim().slice(0, 10);
    let mm = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (mm) [, y, m, d] = mm;
    else if ((mm = s.match(/^(\d{2})-(\d{2})-(\d{4})$/))) [, d, m, y] = mm;
    else return s;
  }
  return `${String(d).padStart(2, '0')}-${String(m).padStart(2, '0')}-${y}`;
}

// startDate === endDate (or no endDate) -> "held on 18-08-2026"
// otherwise                             -> "held from 18-08-2026 to 02-09-2026"
export function formatEventDateText(startDate, endDate) {
  const start = formatCertDate(startDate);
  const end = formatCertDate(endDate);
  if (!start) return '';
  if (!end || end === start) return `held on ${start}`;
  return `held from ${start} to ${end}`;
}
