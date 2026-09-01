// Builds the confirmation email sent to someone who registers for an event.
// Includes the Google Meet link only when one was filled in on the event.
export function buildRegistrationEmail(enrollment, event) {
  const meetLink = event.googleMeetLink || event.meetingLink || '';
  const when = [event.date, [event.startTime, event.endTime].filter(Boolean).join(' – ')].filter(Boolean).join(', ');
  const where = event.mode === 'Online'
    ? 'Online'
    : [event.venue, event.address, event.city].filter(Boolean).join(', ');

  const lines = [
    `Hi ${enrollment.fullName},`,
    ``,
    `Your registration for "${event.title}" is confirmed.`,
    ``,
    when && `When: ${when}`,
    where && `Where: ${where}`,
    event.speaker && `Facilitator: ${event.speaker}`,
    meetLink && `Google Meet link: ${meetLink}`,
    ``,
    `— Ellangala’s Academy`
  ].filter(l => l !== undefined && l !== false);

  return {
    to: enrollment.email,
    subject: `You're registered for ${event.title}`,
    text: lines.join('\n'),
    html: lines.map(l => l === '' ? '<br/>' : `<p>${l}</p>`).join('')
  };
}
