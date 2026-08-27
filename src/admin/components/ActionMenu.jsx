import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical } from 'lucide-react';

export default function ActionMenu({ items = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="action-menu-container" ref={menuRef}>
      <button
        type="button"
        className="action-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
        title="Actions Menu"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div className="action-menu-dropdown">
          {items.map((item, index) => {
            if (item.divider) {
              return <div key={index} className="action-menu-divider" />;
            }

            const Icon = item.icon;

            if (item.to) {
              return (
                <Link
                  key={index}
                  to={item.to}
                  target={item.target || '_self'}
                  className={`action-menu-item ${item.danger ? 'danger' : ''}`}
                  onClick={() => {
                    setIsOpen(false);
                    if (item.onClick) item.onClick();
                  }}
                >
                  {Icon && <Icon size={15} />}
                  <span>{item.label}</span>
                </Link>
              );
            }

            return (
              <button
                key={index}
                type="button"
                className={`action-menu-item ${item.danger ? 'danger' : ''}`}
                onClick={() => {
                  setIsOpen(false);
                  if (item.onClick) item.onClick();
                }}
              >
                {Icon && <Icon size={15} />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
