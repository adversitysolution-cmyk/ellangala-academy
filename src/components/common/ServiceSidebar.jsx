import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { commonContent } from '../../contents/common.content';

export default function ServiceSidebar() {
  const location = useLocation();
  const { serviceSidebar } = commonContent;

  return (
    <div className="col-xl-4">
      <div className="sidebar">
        {/* Start Sidebar Single */}
        <div className="sidebar__single sidebar__services wow animated fadeInUp" data-wow-delay="0.1s">
          <div className="title-box">
            <h2>{serviceSidebar.servicesTitle}</h2>
          </div>
          <div className="sidebar__services-box">
            <ul className="sidebar__services-box-list clearfix">
              {serviceSidebar.services.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={index}>
                    <Link className={isActive ? 'active' : ''} to={item.path}>
                      {item.name}
                      <span className="icon-diagonal-arrow"></span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        {/* End Sidebar Single */}

        {/* Start Sidebar Single */}
        <div className="sidebar__single sidebar__contact wow animated fadeInUp" data-wow-delay="0.3s">
          <div
            className="sidebar__contact-bg"
            style={{ backgroundImage: 'url(/assets/images/services/services-details-img1.jpg)' }}
          ></div>
          <div className="sidebar__contact-box text-center">
            <div className="icon-box">
              <span className="icon-personal-page"></span>
            </div>

            <div className="title">
              <h2>
                Book Your <br />
                Appointment Now
              </h2>
            </div>

            <div className="text-box">
              <p>{serviceSidebar.cta.subtext}</p>
              <h2>
                <a href={`tel:${serviceSidebar.cta.phoneCall}`}>{serviceSidebar.cta.phone}</a>
              </h2>
            </div>
          </div>
        </div>
        {/* End Sidebar Single */}
      </div>
    </div>
  );
}
