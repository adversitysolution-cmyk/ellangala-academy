import React from 'react';
import { homeContent } from '../../contents/home.content';

export default function TestimonialsSection({ data }) {
  const testimonials = data || homeContent.testimonials;

  if (!testimonials || !testimonials.items || testimonials.items.length === 0) {
    return null;
  }

  return (
    <section className="testimonial-one">
      <style>{`
        .testimonial-carousel__one .owl-stage {
          display: flex !important;
        }
        .testimonial-carousel__one .owl-item {
          display: flex !important;
          height: auto !important;
        }
        .testimonial-carousel__one .owl-item > div {
          display: flex !important;
          width: 100% !important;
          height: 100% !important;
        }
        .testimonial-one__single {
          display: flex !important;
          flex-direction: column !important;
          justify-content: space-between !important;
          width: 100% !important;
          height: 100% !important;
          min-height: 360px !important;
          box-sizing: border-box !important;
          padding: 40px 35px 35px 35px !important;
          background-color: #ffffff !important;
          border: 1px solid #e3e3e3 !important;
          transition: all 0.3s ease !important;
        }
        .testimonial-one__single-text {
          flex: 1 1 auto !important;
          display: flex !important;
          align-items: flex-start !important;
          font-size: 18px !important;
          line-height: 32px !important;
          margin-bottom: 25px !important;
          color: #4a4a4a !important;
        }
        .testimonial-one__client-info {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          border-top: 1px solid #e8e2e1 !important;
          padding-top: 25px !important;
          margin-top: auto !important;
          width: 100% !important;
        }
        .testimonial-one__client-details {
          margin-left: 0 !important;
          padding-left: 0 !important;
        }
        .testimonial-one__client-content {
          margin-left: 0 !important;
          padding-left: 0 !important;
        }
        .testimonial-one__client-content h4 {
          color: var(--uterpy-black, #1b263b) !important;
          font-size: 20px !important;
          line-height: 26px !important;
          font-weight: 700 !important;
          margin: 0 0 4px 0 !important;
        }
        .testimonial-one__client-content p {
          color: var(--uterpy-base, #8b6b61) !important;
          font-size: 14px !important;
          line-height: 20px !important;
          margin: 0 !important;
        }
        .testimonial-one__quote {
          flex-shrink: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .testimonial-one__quote span {
          font-size: 36px !important;
          color: var(--uterpy-base, #8b6b61) !important;
          opacity: 0.85 !important;
        }
      `}</style>
      <div
        className="testimonial-one__pattern"
        style={{ backgroundImage: 'url(/assets/images/pattern/testimonial-v1-pattern1.png)' }}
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
              <h6>{testimonials.tagline}</h6>
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
                          <h4>{t.name}</h4>
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
