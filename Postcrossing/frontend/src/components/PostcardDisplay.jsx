import React from 'react';
import './style.css';

const PostcardDisplay = ({ postcard }) => {
  if (!postcard) return null;

  return (
    <div className="postcard-display">
      <img
        src={postcard.image}
        alt={postcard.title || "Selected Postcard"}
        className="postcard-image"
      />
      <div className="attributes">
        <p><strong>Title:</strong> {postcard.title}</p>
        <p><strong>Country:</strong> {postcard.country}</p>
        <p><strong>Topic Theme:</strong> {postcard.topic_cluster.label}</p>
        <p><strong>Color Theme:</strong> {postcard.color_cluster.label}</p>
      </div>
    </div>
  );
};

export default PostcardDisplay;
