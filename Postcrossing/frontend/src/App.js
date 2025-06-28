import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';

//TODO Simply displays random postcard from the API backend for testing, replace with proper frontend code later
function App() {
  const [postcard, setPostcard] = useState(null);
  const [similarPostcards, setSimilarPostcards] = useState([]);

  const fetchRandomPostcard = () => {
    fetch('/api/random-postcard/')
      .then(res => res.json())
      .then(data => {
        console.log('Random postcard data:', data);
        if (!data.error) {
          setPostcard(data);
          // Fetch similar postcards for this postcard
          fetchSimilarPostcards(data.id);
        }
      })
      .catch(error => {
        console.error('Error fetching random postcard:', error);
      });
  };

  const fetchSimilarPostcards = (postcardId) => {
    console.log('Fetching similar postcards for ID:', postcardId);
    fetch(`/api/similar-postcards/${postcardId}/`)
      .then(res => res.json())
      .then(data => {
        console.log('Similar postcards data:', data);
        setSimilarPostcards(data.similar_postcards.slice(0, 3)); // Get first 3 similar postcards
      })
      .catch(error => {
        console.error('Error fetching similar postcards:', error);
        setSimilarPostcards([]);
      });
  };

  // Fetch once on mount
  useEffect(() => {
    fetchRandomPostcard();
  }, []);

  if (!postcard) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Random Postcard</h2>
      
      {/* Main postcard */}
      <div style={{ marginBottom: '30px' }}>
        <img
          src={postcard.image_url}
          alt={`Postcard from ${postcard.country}`}
          style={{ 
            maxWidth: '400px', 
            maxHeight: '300px', 
            cursor: 'pointer',
            border: '2px solid #333',
            borderRadius: '8px'
          }}
          onClick={fetchRandomPostcard}
        />
        <div style={{ marginTop: '10px' }}>
          <p><strong>Country:</strong> {postcard.country}</p>
          <p><strong>Topic:</strong> {postcard.topic_cluster_label}</p>
          <p><strong>Color:</strong> {postcard.color_cluster_label}</p>
          <p><strong>ID:</strong> {postcard.id}</p>
        </div>
      </div>

      {/* Similar postcards */}
      {similarPostcards.length > 0 ? (
        <div>
          <h3>Similar Postcards ({similarPostcards.length})</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '20px',
            maxWidth: '800px'
          }}>
            {similarPostcards.map((similar, index) => (
              <div key={similar.id} style={{ textAlign: 'center' }}>
                <img
                  src={similar.image_url}
                  alt={`Similar postcard from ${similar.country}`}
                  style={{ 
                    maxWidth: '200px', 
                    maxHeight: '150px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                  <strong>{similar.country}</strong>
                </p>
                <p style={{ margin: '2px 0', fontSize: '12px', color: '#666' }}>
                  {similar.topic_cluster_label}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h3>Similar Postcards</h3>
          <p>No similar postcards found or loading...</p>
        </div>
      )}

      <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <small>Click the main image to load another random postcard</small>
      </p>
    </div>
  );
}

export default App;
