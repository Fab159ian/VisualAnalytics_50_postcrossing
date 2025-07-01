import React from 'react';
import './style.css';

const TagSearchBar = ({ value, onChange, onSearch, onReset }) => {
  // value: current input value
  // onChange: function to update input value
  // onSearch: function to trigger search (called on every input change)
  // onReset: function to reset

  const handleInputChange = (e) => {
    onChange(e.target.value);
    onSearch(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // Let parent handle Enter (e.g., select first suggestion)
      onSearch(value, { enter: true });
    }
  };

  const handleReset = () => {
    onChange('');
    onReset();
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search tags..."
        className="search-input"
      />
      <button onClick={handleReset} className="reset-button">Reset Tags</button>
    </div>
  );
};

export default TagSearchBar;