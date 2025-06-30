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
        <p><strong>Avg Brightness:</strong> {postcard.avg_brightness}</p>
        <p><strong>Avg Color Red:</strong> {postcard.avg_color_red}</p>
        <p><strong>Avg Color Green:</strong> {postcard.avg_color_green}</p>
        <p><strong>Avg Color Blue:</strong> {postcard.avg_color_blue}</p>
        <p><strong>Avg Saturation:</strong> {postcard.avg_saturation}</p>
        <p><strong>Country:</strong> {postcard.country}</p>
      </div>
    </div>
  );
};

export default PostcardDisplay;
