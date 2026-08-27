import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = '#CA8A38', bgColor = '#FFF7E8', subtext }) {
  return (
    <div className="admin-stat-card">
      <div>
        <div className="admin-stat-card__val">{value}</div>
        <div className="admin-stat-card__lbl">{title}</div>
        {subtext && (
          <div style={{ fontSize: '12px', color: '#059669', fontWeight: '700', marginTop: '6px' }}>
            {subtext}
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
