import React from 'react';
import HeaderOne from '../components/layout/HeaderOne';
import FooterOne from '../components/layout/FooterOne';
import PageHeader from '../components/common/PageHeader';
import Preloader from '../components/layout/Preloader';
import CustomCursor from '../components/layout/CustomCursor';
import MobileNav from '../components/layout/MobileNav';
import SearchPopup from '../components/layout/SearchPopup';
import ScrollToTop from '../components/layout/ScrollToTop';
import { useUterpyPlugins } from '../hooks/useUterpyPlugins';
import { teamContent } from '../contents/team.content';

export default function Team() {
  useUterpyPlugins();

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <HeaderOne />
        <PageHeader title={teamContent.header.title} breadcrumb={teamContent.header.breadcrumb} />

        {/* Start Team One */}
        <section className="team-one team-one--team">
          <div className="container">
            <div className="row">
              {teamContent.members.map((member, index) => (
                <div
                  key={index}
                  className={`col-xl-4 col-lg-4 col-md-6 wow ${member.dir}`}
                  data-wow-delay={member.delay}
                >
                  <div className="team-one__single">
                    <div className="team-one__single-img">
                      <img src={member.img} alt="#" />
                    </div>

                    <div className="team-one__single-content">
                      <ul className="social-links">
                        <li>
                          <a href="#">
                            <span className="icon-facebook-logo"></span>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <span className="icon-twitter"></span>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <span className="icon-pinterest"></span>
                          </a>
                        </li>
                      </ul>
                      <div className="title-box text-center">
                        <h2>
                          <a href="#">{member.name}</a>
                        </h2>
                        <p>{member.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* End Team One */}

        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
