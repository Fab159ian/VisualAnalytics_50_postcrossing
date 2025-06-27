import React from 'react';

const AttributeFilters = ({ attributes = [] }) => {
  return (
    <div className="border p-2 mb-4">
      <h4 className="font-semibold">Attributes</h4>
      <ul className="list-disc pl-4">
        {attributes.map((attr, i) => (
          <li key={i}>{attr}</li>
        ))}
      </ul>
    </div>
  );
};

export default AttributeFilters;