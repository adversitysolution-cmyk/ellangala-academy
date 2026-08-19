import React from 'react';

export default function Preloader() {
  return (
    <div className="preloader">
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
