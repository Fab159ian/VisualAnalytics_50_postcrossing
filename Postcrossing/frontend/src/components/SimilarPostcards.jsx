import React from 'react';

const SimilarPostcards = ({ postcards = [], onClick }) => {
  console.log(postcards, "SimilarPostcards");

  return (
    <div className="border p-4 mb-4">
      <h3 className="font-bold mb-2">Similar Postcards</h3>
      {postcards.length > 0 ? (
        <div
          className="flex overflow-x-auto gap-4"
          style={{ whiteSpace: 'nowrap' }}
        >
          {postcards.map((p, index) => (
            <div
              key={p.id}
              className="flex flex-col items-center flex-shrink-0"
              style={{ width: '40px' }} // enough space for image + label
            >
              <img
                src={p.image || p.image_url}
                alt={p.title || `Image ${index + 1}`}
                onClick={() => onClick(p.id)}
                className="object-cover rounded cursor-pointer"
                height={"200px"} 
                width={"200px"}
              />
              <span className="text-xs mt-1 whitespace-nowrap">
                Image {index + 1}
              </span>
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
