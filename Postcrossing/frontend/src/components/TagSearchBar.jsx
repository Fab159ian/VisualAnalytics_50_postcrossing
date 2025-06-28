import React, { useState } from 'react';
import './style.css';

const TagSearchBar = ({ onSearch, onReset }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => setSearchTerm(e.target.value);

  const handleSearch = () => onSearch(searchTerm);

  const handleReset = () => {
    setSearchTerm('');
    onReset();
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search tags..."
        className="search-input"
      />
      <button onClick={handleSearch} className="search-button">Search</button>
      {/* <button onClick={handleReset} >Reset</button> */}
    </div>
  );
};

export default TagSearchBar;