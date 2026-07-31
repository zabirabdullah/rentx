import React from 'react';
import { useNavigate } from 'react-router-dom';

const services = [
  {
    id: 1,
    title: 'Moving & Relocation',
    serviceKey: 'moving',
    desc: 'Professional movers to help you shift to your new space effortlessly.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13"></rect>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
        <circle cx="5.5" cy="18.5" r="2.5"></circle>
        <circle cx="18.5" cy="18.5" r="2.5"></circle>
      </svg>
    )
  },
  {
    id: 2,
    title: 'Deep Cleaning',
    serviceKey: 'cleaning',
    desc: 'Thorough cleaning services before you move in or after you move out.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        <circle cx="12" cy="12" r="10"></circle>
      </svg>
    )
  },
  {
    id: 3,
    title: 'Electricians & Plumbers',
    serviceKey: 'plumbing',
    desc: 'Reliable handymen to fix any maintenance issues quickly.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
      </svg>
    )
  },
  {
    id: 4,
    title: 'Painting & Renovation',
    serviceKey: 'painting',
    desc: 'Give your new space a fresh look with our expert painters.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
      </svg>
    )
  }
];

const ServicesPreview = () => {
  const navigate = useNavigate();

  return (
    <section id="services" className="services-section">
      <div className="container">
        <h2 className="section-title">Supporting Services</h2>
        <p className="section-subtitle">We don't just help you find a space; we help you make it yours. Book our verified service professionals today.</p>
        
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-icon-wrapper">
                {service.icon}
              </div>
              <div className="service-content">
                <h3 className="service-title">{service.title}</h3>
                <p className="service-desc">{service.desc}</p>
                <button 
                  className="btn-secondary" 
                  style={{ width: '100%', marginTop: '10px' }}
                  onClick={() => navigate(`/companies?service=${service.serviceKey}`)}
                >
                  Book Service
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
