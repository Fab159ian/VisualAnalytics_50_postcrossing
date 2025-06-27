import React from 'react';

const PostcardMap = ({ postcards = [] }) => {
  return (
    <div className="border p-4 h-[400px] overflow-auto">
      <h3 className="font-bold mb-2">Postcard Map (Tags & Similarity)</h3>
      <div className="grid grid-cols-6 gap-2">
        {postcards.map(p => (
          <img key={p.id} src={p.imageUrl} alt="Postcard" className="w-full h-20 object-cover" />
        ))}
      </div>
    </div>
  );
};

export default PostcardMap;
