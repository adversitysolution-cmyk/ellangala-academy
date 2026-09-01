import { formatCertDate, formatEventDateText } from './certificateDates.js';

// Every dynamic field the certificate template + email may reference.
// The event is the source of truth for event_* fields.
export function buildCertificateVars({ certificate, event, template, verificationUrl }) {
  const organizationName = template?.organizationName || event?.organizer || 'Ellangala’s Academy';
  return {
    participant_name: certificate.participantName || '',
    participant_email: certificate.participantEmail || '',
    participant_phone: certificate.participantPhone || '',

    event_name: event?.title || '',
    start_date: formatCertDate(event?.date),
    end_date: formatCertDate(event?.endDate || event?.date),
    event_date_text: formatEventDateText(event?.date, event?.endDate),
    event_type: event?.category || event?.mode || '',
    venue: event?.mode === 'Online'
      ? 'Online'
      : [event?.venue, event?.address, event?.city].filter(Boolean).join(', '),
    organization_name: organizationName,

    certificate_id: certificate.certificateNumber || '',
    issue_date: formatCertDate(certificate.issuedAt ? new Date(certificate.issuedAt) : new Date()),
    verification_url: verificationUrl || '',
    certificate_qr: verificationUrl || '' // rendered as an image by the PDF layer
  };
}

// Replaces {{ placeholder }} tokens. Unknown tokens are left blank rather than
// leaking "{{foo}}" onto a printed certificate.
export function renderTemplate(text, vars) {
  return String(text || '').replace(/\{\{\s*([a-z_]+)\s*\}\}/gi, (_, key) => {
    const v = vars[key];
    return v === undefined || v === null ? '' : String(v);
  });
}
