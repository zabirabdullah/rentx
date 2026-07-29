import React from 'react';
import './Home.css';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CategoryGrid from './components/CategoryGrid';
import PropertyMapSection from './components/PropertyMapSection';
import ServicesPreview from './components/ServicesPreview';
import Footer from './components/Footer';
import './index.css'

const mockProperties = [
  { id: 1, type: 'House', price: '$1,200/mo', lat: 51.505, lng: -0.09, title: 'Modern Family House', address: '123 Green St', specs: '3 Beds, 2 Baths • 1,500 sq ft', status: 'Available', image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=400&q=80' },
  { id: 2, type: 'Office', price: '$2,500/mo', lat: 51.51, lng: -0.1, title: 'Downtown Office Space', address: '45 Business Ave', specs: '5 Rooms • 2,000 sq ft', status: 'Rent Pending', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80' },
  { id: 3, type: 'Commercial', price: '$4,000/mo', lat: 51.515, lng: -0.09, title: 'Retail Shop', address: '78 High St', specs: 'Open Plan • 3,000 sq ft', status: 'Available', image: 'https://images.unsplash.com/photo-1582005450386-52ccf6f0d141?auto=format&fit=crop&w=400&q=80' },
  { id: 4, type: 'Godown', price: '$1,800/mo', lat: 51.50, lng: -0.11, title: 'Secure Warehouse', address: '99 Industrial Blvd', specs: 'High Ceiling • 5,000 sq ft', status: 'Available', image: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c80a30?auto=format&fit=crop&w=400&q=80' },
  { id: 5, type: 'Garage', price: '$200/mo', lat: 51.49, lng: -0.08, title: 'Covered Parking', address: '12 Park Ln', specs: '1 Space • 200 sq ft', status: 'Available', image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=400&q=80' },
  { id: 6, type: 'ATM Booth', price: '$450/mo', lat: 51.52, lng: -0.08, title: 'Prime Corner Booth', address: 'Corner of 1st & Main', specs: 'Secure • 50 sq ft', status: 'Available', image: 'https://images.unsplash.com/photo-1563944648773-455b9deeb7a7?auto=format&fit=crop&w=400&q=80' }
];

const Home = () => {
  return (
    <div className="rentx-app">
      <Navbar />
      <main>
        <HeroSection />
        <CategoryGrid />
        <PropertyMapSection properties={mockProperties} />
        <ServicesPreview />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
