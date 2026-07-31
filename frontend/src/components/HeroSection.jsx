import React, { useState } from 'react';

const HeroSection = ({ onSearch }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [nearMe, setNearMe] = useState(false);

  const handleSearch = () => {
    let minPrice, maxPrice;
    if (priceRange === '0-5000') { minPrice = 0; maxPrice = 5000; }
    else if (priceRange === '5000-10000') { minPrice = 5000; maxPrice = 10000; }
    else if (priceRange === '10000-20000') { minPrice = 10000; maxPrice = 20000; }
    else if (priceRange === '20000+') { minPrice = 20000; }

    const performSearch = (lat, lng, radius) => {
      onSearch({ search, category, minPrice, maxPrice, lat, lng, radius });
    };

    if (nearMe) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => performSearch(pos.coords.latitude, pos.coords.longitude, 5), // 5km radius
          (err) => {
            alert('Unable to get your location. Searching without radius.');
            performSearch();
          }
        );
      } else {
        alert('Geolocation is not supported by your browser.');
        performSearch();
      }
    } else {
      performSearch();
    }
  };

  return (
    <header className="hero">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            Find Your Perfect Space & <span>Everything Else</span>
          </h1>
          <p className="hero-description">
            RentX is your unified platform for renting or buying properties, plus all the supporting services you need to make it home—moving, cleaning, maintenance, and more.
          </p>
          
          <div className="search-bar" style={{ flexWrap: 'wrap' }}>
            <div className="search-input">
              <label>Location / Keyword</label>
              <input 
                type="text" 
                placeholder="City, Area, or Name" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={nearMe}
                style={{ opacity: nearMe ? 0.5 : 1 }}
              />
            </div>
            <div className="search-divider"></div>
            <div className="search-input">
              <label>Property Type</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Any Type</option>
                <option value="house">House</option>
                <option value="office">Office</option>
                <option value="commercial_space">Commercial Space</option>
                <option value="godown">Godown</option>
                <option value="garage">Garage</option>
                <option value="atm_booth">ATM Booth</option>
              </select>
            </div>
            <div className="search-divider"></div>
            <div className="search-input">
              <label>Price Range (৳)</label>
              <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                <option value="">Any Price</option>
                <option value="0-5000">Under ৳5,000</option>
                <option value="5000-10000">৳5,000 - ৳10,000</option>
                <option value="10000-20000">৳10,000 - ৳20,000</option>
                <option value="20000+">৳20,000+</option>
              </select>
            </div>
            <div className="search-divider"></div>
            <div className="search-input" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="checkbox" 
                id="nearMe" 
                checked={nearMe} 
                onChange={(e) => setNearMe(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <label htmlFor="nearMe" style={{ margin: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                <span>Near Me</span>
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 'normal' }}>(5km Radius)</span>
              </label>
            </div>
            <button className="btn-primary search-btn" onClick={handleSearch}>Explore Listings</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
