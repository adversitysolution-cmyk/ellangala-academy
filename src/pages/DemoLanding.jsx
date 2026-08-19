import React from 'react';
import { Link } from 'react-router-dom';
import Preloader from '../components/layout/Preloader';
import CustomCursor from '../components/layout/CustomCursor';
import { useUterpyPlugins } from '../hooks/useUterpyPlugins';
import { demoLandingContent } from '../contents/demoLanding.content';

export default function DemoLanding() {
  useUterpyPlugins();
  const { banner, features, demos, footer } = demoLandingContent;

  return (
    <>
      <CustomCursor />
      <Preloader />

      <section className="banner-one">
        <div className="banner-one__shape-1"></div>
        <div className="banner-one__shape-2"></div>
        <div className="banner-one__shape-3"></div>

        <img
          src="/assets/images/landing-page/banner-1-1.png"
          width="555"
          height="664"
          alt="Uterpy Home One"
          className="banner-one__image-1 wow fadeInRight"
          data-wow-delay="00ms"
        />
        <img
          src="/assets/images/landing-page/banner-1-2.png"
          width="360"
          height="472"
          alt="Uterpy Home Two"
          className="banner-one__image-2 wow fadeInRight"
          data-wow-delay="500ms"
        />
        <img
          src="/assets/images/landing-page/banner-1-3.png"
          alt="Uterpy Home Three"
          width="342"
          height="353"
          className="banner-one__image-3 wow fadeInRight"
          data-wow-delay="1000ms"
        />

        <div className="container">
          <Link to="/">
            <img
              src="/assets/images/landing-page/logo-1-1.png"
              alt="Ellangala's Academy Logo"
              style={{ maxHeight: '90px', width: 'auto' }}
            />
          </Link>
          <div className="banner-one__rect"></div>
          <h3 className="banner-one__title">
            Psychology &<br /> Counseling React <br />
            Application
          </h3>
          <Link to={banner.btnLink} className="thm-btn">
            {banner.btnText}
          </Link>
        </div>
      </section>

      <section className="features-two">
        <div className="features-two__shape-1"></div>
        <div className="features-two__shape-2"></div>
        <div className="features-two__shape-3"></div>
        <div className="features-two__shape-4"></div>
        <div className="container">
          <h2 className="features-one__title">
            Find Everything you Need <br /> for your Start.
          </h2>
          <div className="row gutter-y-30">
            {features.items.map((f, idx) => (
              <div key={idx} className="col-md-12 col-lg-4 wow fadeInUp" data-wow-delay={f.delay}>
                <div className="features-two__item">
                  <div className="features-two__item__image">
                    <img
                      src={f.img}
                      width="51"
                      height="50"
                      alt={f.title.replace('\n', ' ')}
                    />
                  </div>
                  <h3 className="features-two__item__title">
                    {idx === 0 ? (
                      <>
                        Clean Code with Extensive <br />
                        Documentation
                      </>
                    ) : idx === 1 ? (
                      <>
                        Free Lifetime <br /> Updates
                      </>
                    ) : (
                      <>
                        Expert Ready to Provide you <br /> Quick Support
                      </>
                    )}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="demos-one">
        <div className="container">
          <div className="demos-one__shape"></div>
          <h2 className="features-one__title">{demos.title}</h2>
          <div className="row gutter-y-30">
            {demos.items.map((demo, index) => (
              <div key={index} className="col-lg-4 col-md-6 col-sm-12 wow fadeInUp" data-wow-duration="1500ms" data-wow-delay={demo.delay}>
                <div className="demos-one__item">
                  <div className="demos-one__item__image">
                    <Link to={demo.link}>
                      <img src={demo.img} width="371" height="400" alt={demo.name} />
                    </Link>
                  </div>
                  <h3 className="demos-one__item__title">
                    <Link to={demo.link}>{demo.name}</Link>
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="footer-one">
        <img
          src="/assets/images/landing-page/footer-1-1.png"
          width="41"
          height="114"
          className="footer-one__shape-1 float-bob-y"
          alt="footer shape"
        />
        <img
          src="/assets/images/landing-page/footer-1-2.png"
          width="62"
          height="101"
          className="footer-one__shape-2 float-bob-y"
          alt="footer shape"
        />
        <div className="container">
          <h3 className="footer-one__title">
            Build a Beautiful Website <br /> Right Now!
          </h3>
          <p className="footer-one__text">
            {footer.text}
          </p>
          <Link to={footer.btnLink} className="thm-btn wow fadeInUp" data-wow-duration="1200ms">
            {footer.btnText}
          </Link>
        </div>
      </div>
    </>
  );
}
