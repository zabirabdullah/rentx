import React from 'react';

const categories = [
  {
    id: 1,
    title: 'Houses',
    categoryKey: 'house',
    desc: 'Find comfortable homes and apartments.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    )
  },
  {
    id: 2,
    title: 'Offices',
    categoryKey: 'office',
    desc: 'Professional workspaces for your team.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
        <path d="M9 22v-4h6v4"></path>
        <path d="M8 6h.01"></path>
        <path d="M16 6h.01"></path>
        <path d="M12 6h.01"></path>
        <path d="M12 10h.01"></path>
        <path d="M12 14h.01"></path>
        <path d="M16 10h.01"></path>
        <path d="M16 14h.01"></path>
        <path d="M8 10h.01"></path>
        <path d="M8 14h.01"></path>
      </svg>
    )
  },
  {
    id: 3,
    title: 'Commercial',
    categoryKey: 'commercial_space',
    desc: 'Retail shops and commercial spaces.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 13h20"></path>
        <path d="M4 13V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8"></path>
        <path d="M12 13v8"></path>
        <path d="M8 17h8"></path>
        <path d="M8 21h8"></path>
      </svg>
    )
  },
  {
    id: 4,
    title: 'Godowns',
    categoryKey: 'godown',
    desc: 'Secure storage and warehouse facilities.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 22h20"></path>
        <path d="M5 22V11l7-6 7 6v11"></path>
        <path d="M9 22v-5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v5"></path>
        <path d="M5 11l7-6 7 6"></path>
      </svg>
    )
  },
  {
    id: 5,
    title: 'Garages',
    categoryKey: 'garage',
    desc: 'Safe parking spaces for your vehicles.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="8" width="18" height="12" rx="2"></rect>
        <path d="M5 8V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"></path>
        <circle cx="8" cy="14" r="1"></circle>
        <circle cx="16" cy="14" r="1"></circle>
      </svg>
    )
  },
  {
    id: 6,
    title: 'ATM Booths',
    categoryKey: 'atm_booth',
    desc: 'Strategic locations for banking kiosks.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
        <path d="M6 8h12"></path>
        <path d="M6 12h12"></path>
        <path d="M6 16h4"></path>
      </svg>
    )
  }
];

const CategoryGrid = ({ onSelectCategory }) => {
  return (
    <section id="properties" className="category-section">
      <div className="container">
        <h2 className="section-title">Explore Property Types</h2>
        <p className="section-subtitle">Whether you're looking for a cozy home or a spacious warehouse, we have the perfect space for your needs.</p>
        
        <div className="category-grid">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className="category-card" 
              onClick={() => onSelectCategory && onSelectCategory(category.categoryKey)}
              style={{ cursor: 'pointer' }}
            >
              <div className="category-icon">
                {category.icon}
              </div>
              <h3 className="category-title">{category.title}</h3>
              <p className="category-desc">{category.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
