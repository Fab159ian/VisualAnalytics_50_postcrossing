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
import { ChromePicker } from 'react-color';

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
  const [colorSimilarity, setColorSimilarity] = useState({ red: '', green: '', blue: '', saturation: '' });
  const [colorSimilarIds, setColorSimilarIds] = useState(null);
  const [color, setColor] = useState({ r: 128, g: 128, b: 128, a: 1 });
  

  const handleReset = () => {
    setSelectedPostcard(null); // Clear the selected postcard
    setSelectedTopicCluster(null);
    setSelectedColorCluster(null);
    setSelectedTags([]);
    setColorSimilarity({ red: '', green: '', blue: '', saturation: '' });
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

  const handleColorChange = (colorResult) => {
    setColor(colorResult.rgb);
    setColorSimilarity({
      red: (colorResult.rgb.r / 255).toFixed(3),
      green: (colorResult.rgb.g / 255).toFixed(3),
      blue: (colorResult.rgb.b / 255).toFixed(3),
      saturation: (colorResult.hsl.s).toFixed(3), // hsl.s is already 0-1
    });
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
    const filters = {};
    if (selectedTopicCluster) filters['topic_cluster__cluster_id'] = selectedTopicCluster;
    if (selectedColorCluster) filters['color_cluster__cluster_id'] = selectedColorCluster;
    if (selectedTags.length > 0) filters['tags__name'] = selectedTags.map(t => t.name);

    const { red, green, blue, saturation } = colorSimilarity;
    // Only run color similarity if all values are present and valid
    const allColorValuesPresent = red !== '' && green !== '' && blue !== '' && saturation !== '';
    if (allColorValuesPresent) {
      fetchColorSimilarPostcards({ red, green, blue, saturation, limit: 100 }).then((res) => {
        const ids = res.data.closest_postcards.map(p => p.id);
        setColorSimilarIds(ids);
        // Use comma-separated string for id__in
        fetchPostcards({ ...filters, id__in: ids.join(',') }).then((r) => setPostcards(r.data));
      });
    } else {
      setColorSimilarIds(null);
      fetchPostcards(filters).then((r) => setPostcards(r.data));
    }
  }, [selectedTopicCluster, selectedColorCluster, selectedTags, colorSimilarity.red, colorSimilarity.green, colorSimilarity.blue, colorSimilarity.saturation]);

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
        <div style={{ margin: '8px 0' }}>
          <ChromePicker
            color={color}
            onChange={handleColorChange}
            disableAlpha={true}
          />
          <div style={{ marginTop: 8, fontSize: 12, color: '#555' }}>
            <span>Red: {colorSimilarity.red} | Green: {colorSimilarity.green} | Blue: {colorSimilarity.blue} | Saturation: {colorSimilarity.saturation}</span>
          </div>
        </div>
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
