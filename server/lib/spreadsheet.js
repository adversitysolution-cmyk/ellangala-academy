import * as XLSX from 'xlsx';

// Parses an uploaded .csv/.xlsx/.xls buffer into { headers, rows }.
// rows are objects keyed by the original header text. Admin-only upload +
// SHEET_SIZE_LIMIT (enforced by multer) bound the ReDoS surface in xlsx.
export function parseSheet(buffer) {
  const wb = XLSX.read(buffer, { type: 'buffer', cellDates: false, cellNF: false, cellHTML: false });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  if (!sheet) return { headers: [], rows: [] };

  const matrix = XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: false, defval: '' });
  if (!matrix.length) return { headers: [], rows: [] };

  const headers = matrix[0].map((h) => String(h ?? '').trim()).filter(Boolean);
  const rows = [];
  for (let i = 1; i < matrix.length; i++) {
    const raw = matrix[i];
    const obj = {};
    let hasValue = false;
    headers.forEach((h, idx) => {
      const cell = String(raw[idx] ?? '').trim();
      obj[h] = cell;
      if (cell) hasValue = true;
    });
    if (hasValue) rows.push(obj);
  }
  return { headers, rows };
}

const FIELD_PATTERNS = {
  name: [/^(full\s*)?name$/i, /participant\s*name/i, /student\s*name/i, /attendee\s*name/i, /^your\s*name$/i],
  email: [/^e[-\s]?mail(\s*address)?$/i, /participant\s*email/i, /email\s*id/i],
  phone: [/^phone(\s*(number|no\.?))?$/i, /^mobile(\s*(number|no\.?))?$/i, /contact\s*(number|no\.?)/i, /whatsapp/i]
};

// Best-effort guess of which uploaded column feeds each application field.
// Anything not matched is left for the host to map (or ignore) manually.
export function autoDetectMapping(headers) {
  const mapping = { name: '', email: '', phone: '' };
  for (const header of headers) {
    for (const field of ['name', 'email', 'phone']) {
      if (mapping[field]) continue;
      if (FIELD_PATTERNS[field].some((re) => re.test(header.trim()))) {
        mapping[field] = header;
      }
    }
  }
  return mapping;
}
