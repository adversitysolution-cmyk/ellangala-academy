import React from 'react';
import { Link } from 'react-router-dom';

export default function SubscribeOne() {
  return (
    <section className="subscribe-one" style={{ padding: '42px 0px 40px' }}>
      <div className="shape1 float-bob-y"></div>
      <div className="shape2 float-bob-x"></div>
      <div className="shape3 float-bob-x"></div>
      <div className="shape4 float-bob-y"></div>
      <div className="shape5 float-bob-y">
        <img src="/assets/images/shapes/subscribe-v1-shape1.png" alt="#" />
      </div>
      <div className="shape6 float-bob-y">
        <img src="/assets/images/shapes/subscribe-v1-shape2.png" alt="#" />
      </div>

      <div className="container">
        <div className="row align-items-center">
          {/* Start Left Content */}
          <div className="col-xl-8 col-lg-8">
            <div className="subscribe-one__content">
              <span
                style={{
                  display: 'inline-block',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '13px',
                  fontWeight: '700',
                  letterSpacing: '2.5px',
                  textTransform: 'uppercase',
                  marginBottom: '8px'
                }}
              >
                — LET'S STAY CONNECTED —
              </span>
              <h2
                style={{
                  color: '#ffffff',
                  fontSize: 'clamp(26px, 3vw, 38px)',
                  fontWeight: '700',
                  lineHeight: '1.25',
                  marginBottom: '10px'
                }}
              >
                Start your journey <br />
                towards a better you
              </h2>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '16px',
                  lineHeight: '1.7',
                  maxWidth: '620px',
                  margin: 0
                }}
              >
                Have questions, need guidance or want to know more about our programs? We'd love to hear from you.
              </p>
            </div>
          </div>
          {/* End Left Content */}

          {/* Start Right Button */}
          <div className="col-xl-4 col-lg-4 mt-4 mt-lg-0 text-lg-end">
            <div className="subscribe-one__btn-box">
              <Link
                to="/contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: '#0A1C30',
                  color: '#ffffff',
                  fontSize: '18px',
                  fontWeight: '600',
                  padding: '18px 42px',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  boxShadow: '0px 10px 25px rgba(10, 28, 48, 0.35)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#132C4A';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0px 14px 30px rgba(10, 28, 48, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#0A1C30';
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0px 10px 25px rgba(10, 28, 48, 0.35)';
                }}
              >
                <span>Get in Touch</span>
                <i className="fas fa-arrow-right" style={{ fontSize: '15px' }}></i>
              </Link>
            </div>
          </div>
          {/* End Right Button */}
        </div>
      </div>
    </section>
  );
}
