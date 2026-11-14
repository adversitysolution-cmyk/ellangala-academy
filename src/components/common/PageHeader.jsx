import React from 'react';
import { Link } from 'react-router-dom';

export default function PageHeader({ title, pageName = title, headingTag = 'h1' }) {
  const Heading = headingTag;
  return (
    <section className="page-header">
      <div
        className="page-header__bg"
        style={{
          backgroundImage: 'url("/assets/images/backgrounds/page-header-hero-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>

      <div className="container" style={{ position: 'relative', zIndex: 5 }}>
        <div className="page-header__inner text-start">
          <Heading>{title}</Heading>
          <ul className="thm-breadcrumb">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>{pageName}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
