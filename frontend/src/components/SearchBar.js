import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const SearchBar = ({ setLocation }) => {
  const [input, setInput] = useState('');

  const handleSearch = () => {
    setLocation(input);
  };

  return (
    <div className="search-bar">
      <TextField
        label="Enter your location"
        variant="outlined"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        size="small"
      />
      <Button variant="contained" color="primary" onClick={handleSearch} style={{ marginLeft: '10px' }}>
        Search
      </Button>
    </div>
  );
};

export default SearchBar;
