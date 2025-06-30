import React, { useEffect, useState, useCallback } from "react";
import {
  fetchAllPostcards,
  fetchPostcard,
  fetchSimilarPostcards,
  fetchColorSimilarPostcards,
} from "../services/api";

import PostcardDisplay from "../components/PostcardDisplay";
import TagSearchBar from "../components/TagSearchBar";
import TagFilters from "../components/TagFilters";
import AttributeFilters from "../components/AttributeFilters";
import ControlPanel from "../components/ControlPanel";
import SimilarPostcards from "../components/SimilarPostcards";
import PostcardMap from "../components/PostcardMap";
import Dropdown from "../components/dropdown";

const Dashboard = () => {
  const [postcards, setPostcards] = useState([]);
  console.log(postcards,"postcardspostcards")
  const [selectedId, setSelectedId] = useState("");
  const [selectedPostcard, setSelectedPostcard] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [colorPosts, setColorPosts] = useState([]);
  const [selectedPostcardId, setSelectedPostcardId] = useState(null);
  

   const handleReset = () => {
    setSelectedPostcard(null); // Clear the selected postcard
  };
   const handleSelectSimilar = (id) => {
    setSelectedPostcardId(id);
    // Optionally fetch postcard details for 'id' and setSelectedPostcard(...)
  };

  useEffect(() => {
    fetchAllPostcards().then((res) => setPostcards(res.data));
  }, []);

  // useEffect(() => {
  //   if (selectedId) {
  //     fetchPostcard(selectedId).then((r) => {
  //       const pc = r.data;
  //       setSelectedPostcard(pc);
  //       fetchSimilarPostcards(selectedId).then((r2) => setSimilar(r2.data));
  //       // setTags(pc.tags || []);
  //       // setAttributes(pc.attributes || []);
  //     });
  //   } else {
  //     // setSelectedPostcard(null);
  //     // setSimilar([]);
  //     // setTags([]);
  //     // setAttributes([]);
  //   }
  // }, [selectedId]);


useEffect(() => {
  if (selectedId) {
    fetchPostcard(selectedId).then((r) => {
      setSelectedPostcard(r.data);
      fetchSimilarPostcards(selectedId).then((r2) => {
        const similarArray = Array.isArray(r2.data.similar_postcards)
          ? r2.data.similar_postcards
          : [];
        setSimilar(similarArray); // directly set postcards objects here
      });
    });
  } else {
    setSelectedPostcard(null);
    setSimilar([]);
  }
}, [selectedId]);

// Then, no need to map IDs to postcards, just use `similar` directly:
const similarPostcards = similar || [];



// const allPostcardsMap = React.useMemo(() => {
//   const map = {};
//   postcards.forEach(p => { map[p.id] = p; });
//   return map;
// }, [postcards]);

// const similarPostcards = Array.isArray(similar)
//   ? similar.map(id => allPostcardsMap[id]).filter(Boolean)
//   : [];


  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <Dropdown
          label="Postcard"
          options={postcards}
          value={selectedId}
          onChange={setSelectedId}
          optionLabelKey="title"
        />

       

        {/* Keep your other components */}
        <PostcardDisplay postcard={selectedPostcard} />
        <ControlPanel  onReset={handleReset} />
      </div>

      <div className="main-content">
      <SimilarPostcards postcards={similarPostcards} onClick={handleSelectSimilar} />

        <PostcardMap postcards={postcards} /> 
            {/* <PostcardDisplay postcard={selectedPostcard} /> */}
        {/* <PostcardMap postcards={selectedPostcard ? similar : postcards.concat(colorPosts)} /> */}
      </div>
    </div>
  );
};

export default Dashboard;
