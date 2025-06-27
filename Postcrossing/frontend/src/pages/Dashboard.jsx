import React, { useEffect, useState } from 'react';

import { fetchPostcards } from '../services/api';
import PostcardDisplay from '../components/PostcardDisplay';
import TagSearchBar from '../components/TagSearchBar';
import TagFilters from '../components/TagFilters';
import AttributeFilters from '../components/AttributeFilters';
import ControlPanel from '../components/ControlPanel';
import SimilarPostcards from '../components/SimilarPostcards';
import PostcardMap from '../components/PostcardMap';

const Dashboard = () => {
  const [postcards, setPostcards] = useState([]);
  const [selectedPostcard, setSelectedPostcard] = useState(null);

  useEffect(() => {
    fetchPostcards().then(res => setPostcards(res.data));
  }, []);


const dummyPostcard = {
  image: 'https://via.placeholder.com/300x200?text=Main+Postcard',
  color: 'Blue',
  attributes: 'Landscape, Night View',
};

const dummySimilarPostcards = [
  { image: 'https://via.placeholder.com/100x70?text=Similar+1' },
  { image: 'https://via.placeholder.com/100x70?text=Similar+2' },
  { image: 'https://via.placeholder.com/100x70?text=Similar+3' },
];

  return (
    <div className="dashboard-container">
      {/* left panel */}
      <div className="sidebar">
        <PostcardDisplay postcard={selectedPostcard} />
        <TagSearchBar />
        <TagFilters />
        <AttributeFilters />
        <ControlPanel />
      </div>

      {/* main area */}
      {/* <div className="main-content">
        <SimilarPostcards postcardId={selectedPostcard?.id} />
        <PostcardMap postcards={postcards} />
      </div> */}
      <div style={{ padding: '2rem' }}>
      <PostcardDisplay postcard={dummyPostcard} />
      <SimilarPostcards postcards={dummySimilarPostcards} />
    </div>
    </div>
  );
};

export default Dashboard;
