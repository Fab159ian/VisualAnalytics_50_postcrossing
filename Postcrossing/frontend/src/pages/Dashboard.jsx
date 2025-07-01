import React, { useEffect, useState, useCallback } from "react";
import {
  fetchAllPostcards,
  fetchPostcard,
  fetchPostcards,
  fetchSimilarPostcards,
  fetchColorSimilarPostcards,
  fetchTopicClusters,
  fetchColorClusters,
  searchTags,
} from "../services/api";

import PostcardDisplay from "../components/PostcardDisplay";
import TagSearchBar from "../components/TagSearchBar";
import TagFilters from "../components/TagFilters";
import AttributeFilters from "../components/AttributeFilters";
import ControlPanel from "../components/ControlPanel";
import SimilarPostcards from "../components/SimilarPostcards";
import PostcardMap from "../components/PostcardMap";
import Dropdown from "../components/dropdown";
import TagSelector from "../components/TagSelector";

const Dashboard = () => {
  const [postcards, setPostcards] = useState([]);
  console.log(postcards,"postcardspostcards")
  const [selectedId, setSelectedId] = useState("");
  const [selectedPostcard, setSelectedPostcard] = useState(null);
  const [selectedPostcardId, setSelectedPostcardId] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [topicClusters, setTopicClusters] = useState([]);
  const [selectedTopicCluster, setSelectedTopicCluster] = useState(null);
  const [colorClusters, setColorClusters] = useState([]);
  const [selectedColorCluster, setSelectedColorCluster] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  

  const handleReset = () => {
    setSelectedPostcard(null); // Clear the selected postcard
    setSelectedTopicCluster(null);
    setSelectedColorCluster(null);
  };
  
  const handleSelectSimilar = (id) => {
    if (similarPostcards.length > 0) {
      setSelectedId(id);
    }
  };

  const handleSelectMapPostcard = (id) => {
    if (postcards.length > 0) {
      setSelectedId(id);
    }
  };

  const handleTagsChange = (tags) => {
    setSelectedTags(tags);
  };

  useEffect(() => {
    fetchAllPostcards().then((res) => setPostcards(res.data));
    fetchTopicClusters().then((res) => setTopicClusters(res.data));
    fetchColorClusters().then((res) => setColorClusters(res.data));
  }, []);

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

  useEffect(() => {
    // Build filters
    const filters = {};
    if (selectedTopicCluster) filters['topic_cluster__cluster_id'] = selectedTopicCluster;
    if (selectedColorCluster) filters['color_cluster__cluster_id'] = selectedColorCluster;
    if (selectedTags.length > 0) filters['tags__name'] = selectedTags.map(t => t.name);

    // If you want to add color similarity, check for colorSimilarity here and use fetchColorSimilarPostcards

    fetchPostcards(filters).then((res) => setPostcards(res.data));
  }, [selectedTopicCluster, selectedColorCluster, selectedTags /*, colorSimilarity */]);

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <PostcardDisplay postcard={selectedPostcard} />
        <Dropdown
          label="Topic Cluster"
          options={topicClusters}
          value={selectedTopicCluster}
          onChange={setSelectedTopicCluster}
          optionLabelKey="label"
          optionValueKey="cluster_id"
        />
        <Dropdown
          label="Color Cluster"
          options={colorClusters}
          value={selectedColorCluster}
          onChange={setSelectedColorCluster}
          optionLabelKey="label"
          optionValueKey="cluster_id"
        />
        <TagSelector onTagsChange={handleTagsChange} />
        <ControlPanel  onReset={handleReset} />
      </div>

      <div className="main-content">
        <div className="similar-postcards-row">
          <SimilarPostcards postcards={similarPostcards} onClick={handleSelectSimilar} />
        </div>
        <PostcardMap postcards={postcards} onSelectPostcard={handleSelectMapPostcard} />
      </div>
    </div>
  );
};

export default Dashboard;
