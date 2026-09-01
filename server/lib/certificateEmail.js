// Builds the "your certificate is ready" email. Sends a secure view link,
// not the PDF as an attachment (see spec).
export function buildCertificateEmail({ certificate, event, viewUrl, organizationName }) {
  const org = organizationName || event?.organizer || 'Ellangala’s Academy';
  const lines = [
    `Hi ${certificate.participantName},`,
    ``,
    `Thank you for participating in ${event?.title || 'our event'}.`,
    `Your certificate is now available.`,
    ``,
    `View / download your certificate: ${viewUrl}`,
    ``,
    `Certificate ID: ${certificate.certificateNumber}`,
    ``,
    `Regards,`,
    org
  ];
  return {
    to: certificate.participantEmail,
    subject: `Your Certificate – ${event?.title || 'Ellangala’s Academy'}`,
    text: lines.join('\n'),
    html: lines
      .map((l) => {
        if (l === '') return '<br/>';
        if (l.startsWith('View / download')) {
          return `<p><a href="${viewUrl}" style="background:#CA8A38;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:700">View / Download Certificate</a></p>`;
        }
        return `<p>${l}</p>`;
      })
      .join('')
  };
}
