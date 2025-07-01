import React from 'react';

const SimilarPostcards = ({ postcards = [], onClick }) => {
  console.log(postcards, "SimilarPostcards");

  return (
    <div className="border p-4 mb-4" style={{ width: '100%' }}>
      <h3 className="font-bold mb-2">Similar Postcards</h3>
      {postcards.length > 0 ? (
        <div
          className="similar-postcards-scroll flex gap-4"
          style={{ display: 'flex', flexDirection: 'row', overflowX: 'auto', paddingBottom: 8, width: '100%' }}
        >
          {postcards.map((p) => (
            <div
              key={p.id}
              className="flex flex-col items-center"
              style={{ width: 120, flexShrink: 0 }}
            >
              <img
                src={p.image || p.image_url}
                alt={p.title || `Postcard`}
                onClick={() => onClick(p.id)}
                className="object-cover rounded cursor-pointer"
                style={{ width: 120, height: 120, objectFit: 'cover', background: '#f3f4f6' }}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>No similar postcards found.</p>
      )}
    </div>
  );
};

export default SimilarPostcards;
