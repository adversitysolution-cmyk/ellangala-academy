import React from 'react';

export default function StatusBadge({ status }) {
  const raw = (status || '').trim();
  const s = raw.toLowerCase();

  let statusClass = 'status-draft';
  let label = raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : 'Draft';

  if (['published', 'confirmed', 'enrolled', 'delivered', 'paid'].includes(s)) {
    statusClass = 'status-published';
  } else if (['new', 'pending', 'draft'].includes(s)) {
    statusClass = s === 'new' ? 'status-new' : 'status-draft';
  } else if (['cancelled', 'failed', 'refunded'].includes(s)) {
    statusClass = 'status-cancelled';
  } else if (['completed', 'contacted', 'follow-up', 'processing', 'shipped'].includes(s)) {
    statusClass = 'status-completed';
  }

  return (
    <span className={`status-badge ${statusClass}`}>
      <span className="status-badge__dot" />
      <span>{label}</span>
    </span>
  );
}
