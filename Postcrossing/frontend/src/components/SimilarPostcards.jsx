// src/components/SimilarPostcards.jsx
import React, { useEffect, useState } from 'react';
import { fetchSimilar } from '../services/api';

const SimilarPostcards = ({ postcardId }) => {
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    if (postcardId) {
      fetchSimilar(postcardId).then(res => setSimilar(res.data));
    }
  }, [postcardId]);

  return (
    <div className="border p-4 mb-4">
      <h3 className="font-bold mb-2">Similar Postcards</h3>
      {similar.map(p => (
        <img key={p.id} src={p.imageUrl} alt="Similar" className="w-20 h-20 object-cover inline-block m-1" />
      ))}
    </div>
  );
};

export default SimilarPostcards;