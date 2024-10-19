import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import BusinessTile from './components/BusinessTile';
import UserBalance from './components/UserBalance';
import './App.css';

const App = () => {
  const [location, setLocation] = useState('');
  const [businesses, setBusinesses] = useState([]);
  const [balance, setBalance] = useState(0);

  // Simulate fetching data from an API
  useEffect(() => {
    // Fetch user balance
    setBalance(100.00); // Example balance

    // Fetch nearby businesses based on location
    if (location) {
      const mockBusinesses: any = [
        { name: 'Coffee Shop', category: 'Cafe', distance: '1 km' },
        { name: 'Book Store', category: 'Retail', distance: '2 km' },
        { name: 'Tech Hub', category: 'Electronics', distance: '3 km' },
      ];
      setBusinesses(mockBusinesses);
    }
  }, [location]);

  return (
    <div className="app-container">
      <h1>Business Finder</h1>
      <UserBalance balance={balance} />
      <SearchBar setLocation={setLocation} />
      <div className="business-tile-container">
        {businesses.map((business, index) => (
          <BusinessTile key={index} business={business} />
        ))}
      </div>
    </div>
  );
};

export default App;
