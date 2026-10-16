import React from 'react';

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = '#CA8A38',
  bgColor = '#FFF7E8',
  subtext,
  subtitle,
  subtextColor
}) {
  const note = subtext || subtitle;
  return (
    <div className="admin-stat-card">
      <div>
        <div className="admin-stat-card__val">{value}</div>
        <div className="admin-stat-card__lbl">{title}</div>
        {note && (
          <div style={{ fontSize: '12px', color: subtextColor || (subtext ? '#059669' : '#64748B'), fontWeight: '500', marginTop: '6px' }}>
            {note}
          </div>
        )}
      </div>

      {Icon && (
        <div
          className="admin-stat-card__icon"
          style={{ backgroundColor: bgColor, color: color }}
        >
          <Icon size={22} />
        </div>
      )}
    </div>
  );
}
