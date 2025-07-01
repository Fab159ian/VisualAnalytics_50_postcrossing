import React, { useState } from 'react';
import { searchTags } from '../services/api';
import TagSearchBar from './TagSearchBar';

const TagSelector = ({ onTagsChange }) => {
  const [tagSearchResults, setTagSearchResults] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  const handleTagInputChange = (val) => {
    setTagInput(val);
    if (!val) {
      setTagSearchResults([]);
      return;
    }
    searchTags(val).then((res) => setTagSearchResults(res.data));
  };

  // Accept Enter key to select the first suggestion
  const handleTagSearch = (searchTerm, opts = {}) => {
    setTagInput(searchTerm);
    if (!searchTerm) {
      setTagSearchResults([]);
      return;
    }
    searchTags(searchTerm).then((res) => {
      setTagSearchResults(res.data);
      if (opts.enter && res.data.length > 0) {
        handleTagClick(res.data[0]);
      }
    });
  };

  const handleTagClick = (tag) => {
    if (!selectedTags.some(t => t.id === tag.id)) {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);
      onTagsChange && onTagsChange(newTags);
    }
    setTagInput('');
    setTagSearchResults([]);
  };

  const handleRemoveTag = (tagId) => {
    const newTags = selectedTags.filter(t => t.id !== tagId);
    setSelectedTags(newTags);
    onTagsChange && onTagsChange(newTags);
  };

  const handleTagReset = () => {
    setTagSearchResults([]);
    setSelectedTags([]);
    setTagInput('');
    onTagsChange && onTagsChange([]);
  };

  return (
    <div>
      <TagSearchBar
        value={tagInput}
        onChange={handleTagInputChange}
        onSearch={handleTagSearch}
        onReset={handleTagReset}
      />
      {selectedTags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '8px 0' }}>
          {selectedTags.map(tag => (
            <span key={tag.id} style={{ background: '#e0e7ff', color: '#1e3a8a', borderRadius: 16, padding: '4px 12px', display: 'flex', alignItems: 'center', fontWeight: 500 }}>
              {tag.name}
              <button onClick={() => handleRemoveTag(tag.id)} style={{ marginLeft: 8, background: 'none', border: 'none', color: '#1e3a8a', cursor: 'pointer', fontWeight: 'bold' }}>&times;</button>
            </span>
          ))}
        </div>
      )}
      {tagInput && tagSearchResults.length > 0 && (
        <div style={{ border: '2px solid #2563eb', borderRadius: 8, padding: 8, marginTop: 8, background: 'white', zIndex: 10 }}>
          {tagSearchResults.map((tag) => (
            <div
              key={tag.id}
              style={{ padding: '4px 0', cursor: 'pointer', color: selectedTags.some(t => t.id === tag.id) ? '#2563eb' : '#1e3a8a', fontWeight: selectedTags.some(t => t.id === tag.id) ? 'bold' : 'normal' }}
              onClick={() => handleTagClick(tag)}
            >
              {tag.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagSelector; 