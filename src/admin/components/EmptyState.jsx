import React from 'react';
import { FileQuestion } from 'lucide-react';

export default function EmptyState({ title = "No data found", description = "There are no records matching your request." }) {
  return (
    <div style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#FAF5EC',
          color: '#CA8A38',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}
      >
        <FileQuestion size={32} />
      </div>
      <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0F231B', marginBottom: '6px' }}>
        {title}
      </h3>
      <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '420px', margin: '0 auto' }}>
        {description}
      </p>
    </div>
  );
}
