import React from 'react';
import { homeContent } from '../../contents/home.content';

export default function TestimonialsSection({ data }) {
  const testimonials = data || homeContent.testimonials;

  if (!testimonials || !testimonials.items || testimonials.items.length === 0) {
    return null;
  }

  return (
    <section className="testimonial-one">
      <div
        className="testimonial-one__pattern"
        style={{ backgroundImage: 'url(/assets/images/pattern/testimonial-v1-pattern1.webp)' }}
      ></div>
      <div className="carousel-control-block__outer">
        <div className="carousel-control-block">
          <div className="carousel-btn-block testimonial-carousel-btn">
            <span className="carousel-btn left-btn">
              <i className="icon-right-arrow"></i>
            </span>
            <span className="carousel-btn right-btn">
              <i className="icon-right-arrow1"></i>
            </span>
          </div>
          <div className="carousel-number-count"></div>
        </div>
      </div>
      <div className="container">
        <div className="sec-title">
          {testimonials.tagline && (
            <div className="sec-title__tagline">
              <span>{testimonials.tagline}</span>
            </div>
          )}
          {testimonials.title && (
            <h2 className="sec-title__title">
              {testimonials.title.split('\n').map((line, lIdx, arr) => (
                <React.Fragment key={lIdx}>
                  {line}
                  {lIdx < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h2>
          )}
        </div>
        <div className="row">
          <div className="col-xl-12">
            <div className="testimonial-one__inner">
              <div className="testimonial-carousel__one owl-theme owl-carousel">
                {testimonials.items.map((t, idx) => (
                  <div key={idx} className="testimonial-one__slide testimonial-one__single">
                    <p className="testimonial-one__single-text">
                      {t.text}
                    </p>
                    <div className="testimonial-one__client-info">
                      <div className="testimonial-one__client-details">
                        <div className="testimonial-one__client-content">
                          <h3>{t.name}</h3>
                          <p>{t.role}</p>
                        </div>
                      </div>
                      <div className="testimonial-one__quote">
                        <span className="icon-quote"></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
