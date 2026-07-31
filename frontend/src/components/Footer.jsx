import React from 'react';
import { Link } from 'react-router-dom';

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
              <li><Link to="/properties?category=House">Houses & Apartments</Link></li>
              <li><Link to="/properties?category=Office">Office Spaces</Link></li>
              <li><Link to="/properties?category=Commercial">Commercial</Link></li>
              <li><Link to="/properties?category=Godown">Godowns & Warehouses</Link></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h3>Services</h3>
            <ul>
              <li><Link to="/companies?service=moving">Moving & Packing</Link></li>
              <li><Link to="/companies?service=cleaning">Deep Cleaning</Link></li>
              <li><Link to="/companies?service=plumbing">Maintenance</Link></li>
              <li><Link to="/companies?service=painting">Painting</Link></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h3>Company</h3>
            <ul>
              <li><Link to="/about#about">About Us</Link></li>
              <li><Link to="/about#contact">Contact</Link></li>
              <li><Link to="/about#privacy">Privacy Policy</Link></li>
              <li><Link to="/about#terms">Terms of Service</Link></li>
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
