import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h2>RentX</h2>
            <p>Your one-stop destination for finding properties and the services to maintain them.</p>
          </div>
          
          <div className="footer-col">
            <h3>Properties</h3>
            <ul>
              <li><a href="#houses">Houses & Apartments</a></li>
              <li><a href="#offices">Office Spaces</a></li>
              <li><a href="#commercial">Commercial</a></li>
              <li><a href="#warehouses">Godowns & Warehouses</a></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h3>Services</h3>
            <ul>
              <li><a href="#moving">Moving & Packing</a></li>
              <li><a href="#cleaning">Deep Cleaning</a></li>
              <li><a href="#maintenance">Maintenance</a></li>
              <li><a href="#painting">Painting</a></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h3>Company</h3>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} RentX Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
