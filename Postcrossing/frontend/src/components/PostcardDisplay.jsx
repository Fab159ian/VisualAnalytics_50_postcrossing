import React from 'react';
import './style.css';

const PostcardDisplay = ({ postcard }) => {
  if (!postcard) {
    return <div className="postcard-display">No postcard selected.</div>;
  }

  return (
    <div className="postcard-display">
      <h2>Selected Postcard</h2>
      <img src={postcard.image} alt="Selected Postcard" className="postcard-image" />
      <div className="attributes">
        <p><strong>Color:</strong> {postcard.color}</p>
        <p><strong>Other Attributes:</strong> {postcard.attributes}</p>
      </div>
    </div>
  );
};

export default PostcardDisplay;
