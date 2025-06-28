import React, { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  /*
  const [postcard, setPostcard] = useState(null);
  const [similarPostcards, setSimilarPostcards] = useState([]);
  const [colorPostcards, setColorPostcards] = useState([]);
  const [colorValues, setColorValues] = useState({
    red: '',
    green: '',
    blue: '',
    saturation: ''
  });
  
  const fetchSimilarPostcards = useCallback((postcardId) => {
    console.log('Fetching similar postcards for ID:', postcardId);
    fetch(`/api/similar-postcards/${postcardId}/`)
    .then(res => res.json())
    .then(data => {
      console.log('Similar postcards data:', data);
      // Randomly select 3 postcards from the 10 similar postcards
      const allSimilar = data.similar_postcards;
      const shuffled = [...allSimilar].sort(() => 0.5 - Math.random());
      setSimilarPostcards(shuffled.slice(0, 3));
    })
    .catch(error => {
      console.error('Error fetching similar postcards:', error);
      setSimilarPostcards([]);
    });
  }, []);
  
    const fetchRandomPostcard = useCallback(() => {
      fetch('/api/get-postcard/')
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
    }, [fetchSimilarPostcards]);
  
  const fetchPostcardById = useCallback((postcardId) => {
    fetch(`/api/get-postcard/?id=${postcardId}`)
      .then(res => res.json())
      .then(data => {
        console.log('Postcard data:', data);
        if (!data.error) {
          setPostcard(data);
          // Fetch similar postcards for this postcard
          fetchSimilarPostcards(data.id);
        }
      })
      .catch(error => {
        console.error('Error fetching postcard:', error);
      });
  }, [fetchSimilarPostcards]);

  const fetchColorSimilarPostcards = useCallback((e) => {
    e.preventDefault();
    const { red, green, blue, saturation } = colorValues;
    
    if (!red || !green || !blue || !saturation) {
      alert('Please fill in all color values');
      return;
    }

    const queryString = `red=${red}&green=${green}&blue=${blue}&saturation=${saturation}`;
    
    fetch(`/api/color-similar/?${queryString}`)
      .then(res => res.json())
      .then(data => {
        console.log('Color similar postcards data:', data);
        if (data.closest_postcards) {
          setColorPostcards(data.closest_postcards.slice(0, 5)); // Get first 5 postcards
        }
      })
      .catch(error => {
        console.error('Error fetching color similar postcards:', error);
        setColorPostcards([]);
      });
  }, [colorValues]);

  const handleColorChange = useCallback((field, value) => {
    setColorValues(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSimilarPostcardClick = useCallback((postcardId) => {
    fetchPostcardById(postcardId);
  }, [fetchPostcardById]);

  // Fetch once on mount
  useEffect(() => {
    fetchRandomPostcard();
  }, [fetchRandomPostcard]);

  if (!postcard) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px'}}>
      <h2>Random Postcard</h2>
      
      {/* Main postcard *//*}
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
        <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          <small>Click the main image to load another random postcard</small>
        </p>
      </div>

      {/* Similar postcards *//*}
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
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleSimilarPostcardClick(similar.id)}
                />
                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                  <strong>{similar.country}</strong>
                </p>
                <p style={{ margin: '2px 0', fontSize: '12px', color: '#666' }}>
                  {similar.topic_cluster_label}
                </p>
                <p style={{ margin: '2px 0', fontSize: '10px', color: '#999' }}>
                  <small>Click to view</small>
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

      {/* Color-based search *//*}
      <div style={{ marginTop: '40px', borderTop: '2px solid #eee', paddingTop: '20px' }}>
        <h3>Find Postcards by Color</h3>
        <form onSubmit={fetchColorSimilarPostcards} style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '10px',
            maxWidth: '600px',
            marginBottom: '15px'
          }}>
            <div>
              <label>Red (0-1):</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={colorValues.red}
                onChange={(e) => handleColorChange('red', e.target.value)}
                style={{ width: '100%', padding: '5px' }}
              />
            </div>
            <div>
              <label>Green (0-1):</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={colorValues.green}
                onChange={(e) => handleColorChange('green', e.target.value)}
                style={{ width: '100%', padding: '5px' }}
              />
            </div>
            <div>
              <label>Blue (0-1):</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={colorValues.blue}
                onChange={(e) => handleColorChange('blue', e.target.value)}
                style={{ width: '100%', padding: '5px' }}
              />
            </div>
            <div>
              <label>Saturation (0-1):</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={colorValues.saturation}
                onChange={(e) => handleColorChange('saturation', e.target.value)}
                style={{ width: '100%', padding: '5px' }}
              />
            </div>
          </div>
          <button 
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Find Similar Postcards
          </button>
        </form>

        {/* Color-based results *//*}
        {colorPostcards.length > 0 && (
          <div>
            <h4>Color-Similar Postcards ({colorPostcards.length})</h4>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(5, 1fr)', 
              gap: '15px',
              maxWidth: '1000px'
            }}>
              {colorPostcards.map((postcard, index) => (
                <div key={postcard.id} style={{ textAlign: 'center' }}>
                  <img
                    src={postcard.image_url}
                    alt={`Color similar postcard from ${postcard.country}`}
                    style={{ 
                      maxWidth: '150px', 
                      maxHeight: '120px',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  />
                  <p style={{ margin: '5px 0', fontSize: '12px' }}>
                    <strong>{postcard.country}</strong>
                  </p>
                  <p style={{ margin: '2px 0', fontSize: '10px', color: '#666' }}>
                    Distance: {postcard.distance}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
  */
  return <Dashboard />;
}

export default App;
