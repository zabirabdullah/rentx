import React from 'react';

const HeroSection = () => {
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
          
          <div className="search-bar">
            <div className="search-input">
              <label>Location</label>
              <input type="text" placeholder="City, Area, or Zip" />
            </div>
            <div className="search-divider"></div>
            <div className="search-input">
              <label>Property Type</label>
              <select defaultValue="">
                <option value="" disabled>Select Type</option>
                <option value="house">House</option>
                <option value="office">Office</option>
                <option value="commercial">Commercial</option>
                <option value="godown">Godown</option>
                <option value="garage">Garage</option>
                <option value="atm">ATM Booth</option>
              </select>
            </div>
            <div className="search-divider"></div>
            <div className="search-input">
              <label>Price Range</label>
              <select defaultValue="">
                <option value="" disabled>Any Price</option>
                <option value="0-500">Under $500</option>
                <option value="500-1000">$500 - $1,000</option>
                <option value="1000-2000">$1,000 - $2,000</option>
                <option value="2000+">$2,000+</option>
              </select>
            </div>
            <button className="btn-primary search-btn">Explore Listings</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
