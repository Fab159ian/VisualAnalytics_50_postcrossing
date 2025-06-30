import React, { useState, useEffect } from 'react';
import './style.css'; // Import the CSS file

const PostcardMap = ({ postcards = [] }) => {
  console.log(postcards,"postcards")
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (postcards.length > 0) {
      setLoading(false);
    }
  }, [postcards]);

  return (
    <>
   
    <div className="postcard-container">
        <h3 className="title">Postcard Map </h3>
      {loading ? (
        <div className="loading">Loading postcards...</div>
      ) : (
        <div className="postcard-flex-wrapper">
          {postcards.map((p) => (
            <div key={p.id} className="postcard-item">
              <img
                src={p.image}
                alt="Postcard"
                className="postcard-image"
              />
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default PostcardMap;
