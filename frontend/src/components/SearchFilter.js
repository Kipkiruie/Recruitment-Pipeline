import React, { useState } from 'react';

const SearchFilter = ({ onSearch }) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState('');

  const handleSearch = () => {
    onSearch({ name, position, status });
  };

  return (
    <div className="search-filter">
      <input
        type="text"
        placeholder="Search by name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Filter by position"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">Filter by status</option>
        <option value="Pending">Pending</option>
        <option value="Shortlisted">Shortlisted</option>
        <option value="Rejected">Rejected</option>
      </select>
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchFilter;
