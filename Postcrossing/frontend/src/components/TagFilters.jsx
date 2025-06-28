// src/components/TagFilters.jsx
import React from 'react';

const TagFilters = ({ selectedTags = [] }) => {
  return (
    <div className="border p-2 mb-4">
      <h4 className="font-semibold">Selected Tags</h4>
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedTags.map((tag, i) => (
          <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagFilters;