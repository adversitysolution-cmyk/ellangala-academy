import React from 'react';

export default function ScrollToTop() {
  const handleClick = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <a
      href="#"
      onClick={handleClick}
      data-target="html"
      className="scroll-to-target scroll-to-top"
    >
      <i className="fa fa-angle-up"></i>
    </a>
  );
}
