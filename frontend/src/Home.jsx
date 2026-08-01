import { useState, useEffect, useRef } from 'react';
import './Home.css';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CategoryGrid from './components/CategoryGrid';
import PropertyMapSection from './components/PropertyMapSection';
import ServicesPreview from './components/ServicesPreview';
import Footer from './components/Footer';
import './index.css'

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({});
  const mapSectionRef = useRef(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.minPrice !== undefined) queryParams.append('minPrice', filters.minPrice);
        if (filters.maxPrice !== undefined) queryParams.append('maxPrice', filters.maxPrice);
        if (filters.lat !== undefined) queryParams.append('lat', filters.lat);
        if (filters.lng !== undefined) queryParams.append('lng', filters.lng);
        if (filters.radius !== undefined) queryParams.append('radius', filters.radius);

        const response = await fetch(`http://localhost:5000/api/properties?${queryParams.toString()}`);
        if (response.ok) {
          const data = await response.json();
          // Filter to only properties that have valid lat/lng and are available
          const validProps = data.filter(p => p.lat && p.lng);
          setProperties(validProps);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    fetchProperties();
  }, [filters]);

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (category) => {
    const targetCategory = category === 'All' ? '' : category;
    handleSearch({ ...filters, category: targetCategory });
  };

  const handleMapCategoryChange = (category) => {
    const targetCategory = category === 'All' ? '' : category;
    setFilters(prev => ({ ...prev, category: targetCategory }));
  };

  return (
    <div className="rentx-app">
      <Navbar />
      <main>
        <HeroSection onSearch={handleSearch} />
        <CategoryGrid onSelectCategory={handleCategorySelect} />
        <div ref={mapSectionRef}>
          <PropertyMapSection 
            properties={properties} 
            selectedCategory={filters.category || 'All'}
            onCategoryChange={handleMapCategoryChange}
          />
        </div>
        <ServicesPreview />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
