import React, { useEffect, useState } from 'react';

export default function Preloader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHidden(true);
    }, 180);
    return () => clearTimeout(timer);
  }, []);

  if (hidden) return null;

  return (
    <div className="preloader" style={{ transition: 'opacity 0.2s ease' }}>
      <div
        className="preloader__image"
        style={{
          backgroundImage: 'url(/assets/images/resources/ellangalas-logo.png)',
          backgroundSize: '160px auto',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>
    </div>
  );
}
