import React from 'react';
import { commonContent } from '../../contents/common.content';

export default function SearchPopup() {
  const { searchPopup } = commonContent;

  return (
    <div className="search-popup">
      <div className="search-popup__overlay search-toggler"></div>
      <div className="search-popup__content">
        <form action="#">
          <label htmlFor="search" className="sr-only">
            {searchPopup.label}
          </label>
          <input type="text" id="search" placeholder={searchPopup.placeholder} />
          <button type="submit" aria-label="search submit" className="thm-btn">
            <i className="icon-search"></i>
          </button>
        </form>
      </div>
    </div>
  );
}
