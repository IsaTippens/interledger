import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import BusinessTile from './components/BusinessTile';
import UserBalance from './components/UserBalance';
import './App.css';

// Define the structure of a business
interface Business {
  id: number;
  name: string;
  address: string;
  category: string;
  amount: number;
  wallet_url: string;
}

const App = () => {
  const [location, setLocation] = useState<string>('');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [balance, setBalance] = useState<number>(100.0);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  const services = ['Cleaning', 'Gardening', 'Babysitting', 'Catering'];

  useEffect(() => {
    fetch('http://localhost:3000/data/businesses')
      .then((res) => res.json())
      .then((data: { businesses: Business[] }) => {
        console.log({ data });
        setBusinesses(data.businesses);
      })
      .catch((error) => {
        console.error('Error fetching businesses:', error);
      });
  }, []);

  // Handle closing modal
  const handleCloseModal = () => setSelectedBusiness(null);

  // Handle payment action
  const handlePayment = (amount: number) => {
    if (balance >= amount) {
      setBalance(balance - amount);
      alert(`Payment successful! New balance: $${balance - amount}`);
      setSelectedBusiness(null);
    } else {
      alert('Insufficient balance!');
    }
  };

  return (
    <div className="app-container">
      <h1>LOCAL ROOTS</h1>
      <UserBalance balance={balance} />

      <div className="search-container">
        <SearchBar setLocation={setLocation} />
        <div className="service-dropdown">
          <label htmlFor="service">Choose a service:</label>
          <select
            id="service"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
          >
            <option value="">All services</option>
            {services.map((service, index) => (
              <option key={index} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="business-tile-container">
        {businesses.length > 0 ? (
          businesses.map((business) => (
            <div key={business.id} onClick={() => setSelectedBusiness(business)}>
              <BusinessTile business={business} />
            </div>
          ))
        ) : (
          <p>No businesses found</p>
        )}
      </div>

      {/* Modal for Business Details */}
      {selectedBusiness && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>{selectedBusiness.name}</h2>
            <p>ID: {selectedBusiness.id}</p>
            <p>Address: {selectedBusiness.address}</p>
            <p>Category: {selectedBusiness.category}</p>
            <p>Service Amount: ${selectedBusiness.amount}</p>
            <button onClick={() => handlePayment(selectedBusiness.amount)}>
              Proceed with Payment
            </button>
            <button onClick={handleCloseModal}>Exit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
