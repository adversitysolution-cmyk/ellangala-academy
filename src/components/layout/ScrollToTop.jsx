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
    <button
      type="button"
      onClick={handleClick}
      data-target="html"
      className="scroll-to-target scroll-to-top"
      aria-label="Scroll to top"
    >
      <i className="fa fa-angle-up"></i>
    </button>
  );
}
