import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';

//TODO Simply displays random postcard from the API backend for testing, replace with proper frontend code later
function App() {
  const [postcard, setPostcard] = useState(null);

  const fetchRandomPostcard = () => {
    fetch('/api/random-postcard/')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setPostcard(data);
        }
      });
  };

  // Fetch once on mount
  useEffect(() => {
    fetchRandomPostcard();
  }, []);

  if (!postcard) return <p>Loading...</p>;

  return (
    <div>
      <h2>Random Postcard</h2>
      <img
        src={postcard.image_url}
        alt={`Postcard from ${postcard.country}`}
        style={{ maxWidth: '100%', cursor: 'pointer' }}
        onClick={fetchRandomPostcard}
      />
      <p>Country: {postcard.country}</p>
      <p><small>Click the image to load another postcard</small></p>
    </div>
  );
}

export default App;
