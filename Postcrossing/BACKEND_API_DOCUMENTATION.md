# Backend API Documentation

## Overview

The backend now provides comprehensive search and filtering capabilities for the frontend through RESTful ViewSets. This enables efficient dropdown population and search functionality.

## New API Endpoints

### 1. Tag Search API

**Endpoint:** `GET /api/tags/`

**Search Parameters:**
- `search` - Search tags by name (case-insensitive)

**Examples:**
```javascript
// Get all tags
fetchTags()

// Search for tags containing "tiger"
searchTags('tiger')

// Direct API call with search
api.get('/tags/?search=landscape')
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "blue"
  },
  {
    "id": 2,
    "name": "blue sky"
  }
]
```

### 2. Topic Cluster API

**Endpoint:** `GET /api/topic-clusters/`

**Search Parameters:**
- `search` - Search cluster labels (case-insensitive)

**Examples:**
```javascript
// Get all topic clusters
fetchTopicClusters()

// Search for clusters containing "landscape"
fetchTopicClusters('landscape')

// Direct API call
api.get('/topic-clusters/?search=night')
```

**Response:**
```json
[
  {
    "id": 1,
    "cluster_id": 5,
    "label": "Landscape"
  },
  {
    "id": 2,
    "cluster_id": 8,
    "label": "Night Landscape"
  }
]
```

### 3. Color Cluster API

**Endpoint:** `GET /api/color-clusters/`

**Search Parameters:**
- `search` - Search cluster labels (case-insensitive)

**Examples:**
```javascript
// Get all color clusters
fetchColorClusters()

// Search for clusters containing "blue"
fetchColorClusters('blue')

// Direct API call
api.get('/color-clusters/?search=warm')
```

**Response:**
```json
[
  {
    "id": 1,
    "cluster_id": 3,
    "label": "Blue Tones"
  },
  {
    "id": 2,
    "cluster_id": 7,
    "label": "Warm Colors"
  }
]
```

## Frontend Integration Examples

### 1. Searchable Tag Dropdown

```javascript
import { searchTags } from '../services/api';

const TagSearchDropdown = () => {
  const [tags, setTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async (term) => {
    try {
      const response = await searchTags(term);
      setTags(response.data);
    } catch (error) {
      console.error('Error searching tags:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search tags..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          handleSearch(e.target.value);
        }}
      />
      <select>
        {tags.map(tag => (
          <option key={tag.id} value={tag.id}>
            {tag.name}
          </option>
        ))}
      </select>
    </div>
  );
};
```

### 2. Searchable Topic Cluster Dropdown

```javascript
import { fetchTopicClusters } from '../services/api';

const TopicClusterDropdown = () => {
  const [clusters, setClusters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async (term) => {
    try {
      const response = await fetchTopicClusters(term);
      setClusters(response.data);
    } catch (error) {
      console.error('Error searching topic clusters:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search topic clusters..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          handleSearch(e.target.value);
        }}
      />
      <select>
        {clusters.map(cluster => (
          <option key={cluster.id} value={cluster.cluster_id}>
            {cluster.label}
          </option>
        ))}
      </select>
    </div>
  );
};
```

### 3. Searchable Color Cluster Dropdown

```javascript
import { fetchColorClusters } from '../services/api';

const ColorClusterDropdown = () => {
  const [clusters, setClusters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async (term) => {
    try {
      const response = await fetchColorClusters(term);
      setClusters(response.data);
    } catch (error) {
      console.error('Error searching color clusters:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search color clusters..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          handleSearch(e.target.value);
        }}
      />
      <select>
        {clusters.map(cluster => (
          <option key={cluster.id} value={cluster.cluster_id}>
            {cluster.label}
          </option>
        ))}
      </select>
    </div>
  );
};
```

## Advanced Filtering Examples

### Example 1: Combined Topic Cluster, Color Cluster, and Tag Filtering

This example shows how to filter postcards using multiple criteria simultaneously:

```javascript
// Filter postcards by topic cluster, color cluster, and specific tags
const filterByClustersAndTags = async (topicClusterId, colorClusterId, tagNames) => {
  const filters = {};
  
  // Add topic cluster filter
  if (topicClusterId) {
    filters['topic_cluster__cluster_id'] = topicClusterId;
  }
  
  // Add color cluster filter
  if (colorClusterId) {
    filters['color_cluster__cluster_id'] = colorClusterId;
  }
  
  // Add tag filters (can be multiple tags)
  if (tagNames && tagNames.length > 0) {
    filters['tags__name'] = tagNames;
  }
  
  try {
    const response = await fetchPostcards(filters);
    return response.data;
  } catch (error) {
    console.error('Error filtering postcards:', error);
    return [];
  }
};

// Usage example:
const findLandscapeBlueNaturePostcards = async () => {
  const results = await filterByClustersAndTags(
    5,                    // Topic cluster ID for "Landscape"
    3,                    // Color cluster ID for "Blue Tones"
    ['nature', 'tree']    // Tags to filter by
  );
  
  console.log(`Found ${results.length} landscape blue nature postcards`);
  return results;
};
```

### Example 2: Color Similarity + Tag Filtering

This example demonstrates how to use the color similarity function and then filter the results by tags:

```javascript
// Step 1: Find postcards similar to a specific color
const findColorSimilarPostcards = async (red, green, blue, saturation, limit = 20) => {
  try {
    const response = await fetchColorSimilarPostcards({
      red: red,
      green: green,
      blue: blue,
      saturation: saturation,
      limit: limit
    });
    
    return response.data.closest_postcards;
  } catch (error) {
    console.error('Error finding color similar postcards:', error);
    return [];
  }
};

// Step 2: Filter those postcards by tags
const filterColorSimilarByTags = async (red, green, blue, saturation, tagNames) => {
  // First, get color similar postcards
  const colorSimilarPostcards = await findColorSimilarPostcards(red, green, blue, saturation);
  
  // Extract the IDs of color similar postcards
  const colorSimilarIds = colorSimilarPostcards.map(p => p.id);
  
  // Then filter by those IDs and tags
  const filters = {
    'id': colorSimilarIds,
    'tags__name': tagNames
  };
  
  try {
    const response = await fetchPostcards(filters);
    return response.data;
  } catch (error) {
    console.error('Error filtering color similar postcards by tags:', error);
    return [];
  }
};

// Usage example: Find blue postcards similar to sky blue that have nature tags
const findBlueNaturePostcards = async () => {
  const results = await filterColorSimilarByTags(
    0.5,                  // Red component (low for blue)
    0.7,                  // Green component (medium)
    0.9,                  // Blue component (high for sky blue)
    0.6,                  // Saturation
    ['nature', 'sky', 'cloud']  // Tags to filter by
  );
  
  console.log(`Found ${results.length} blue nature postcards similar to sky blue`);
  return results;
};
```

### Example 3: Complex Multi-Criteria Filtering

This example shows a more complex scenario combining multiple filtering approaches:

```javascript
// Advanced filtering with multiple criteria
const advancedPostcardFiltering = async (filters) => {
  const {
    topicClusterId,
    colorClusterId,
    tagNames,
    colorSimilarity,
    searchTerm,
    ordering
  } = filters;
  
  let postcardIds = null;
  
  // Step 1: If color similarity is specified, get those postcard IDs first
  if (colorSimilarity) {
    const { red, green, blue, saturation, limit } = colorSimilarity;
    const colorSimilarPostcards = await findColorSimilarPostcards(red, green, blue, saturation, limit);
    postcardIds = colorSimilarPostcards.map(p => p.id);
  }
  
  // Step 2: Build the main filter object
  const filterParams = {};
  
  // Add ID filter if we have color similar postcard IDs
  if (postcardIds) {
    filterParams['id'] = postcardIds;
  }
  
  // Add topic cluster filter
  if (topicClusterId) {
    filterParams['topic_cluster__cluster_id'] = topicClusterId;
  }
  
  // Add color cluster filter
  if (colorClusterId) {
    filterParams['color_cluster__cluster_id'] = colorClusterId;
  }
  
  // Add tag filters
  if (tagNames && tagNames.length > 0) {
    filterParams['tags__name'] = tagNames;
  }
  
  // Add search term
  if (searchTerm) {
    filterParams['search'] = searchTerm;
  }
  
  // Add ordering
  if (ordering) {
    filterParams['ordering'] = ordering;
  }
  
  try {
    const response = await fetchPostcards(filterParams);
    return response.data;
  } catch (error) {
    console.error('Error in advanced filtering:', error);
    return [];
  }
};

// Usage example: Find warm-colored landscape postcards similar to sunset colors with nature tags
const findSunsetLandscapePostcards = async () => {
  const results = await advancedPostcardFiltering({
    topicClusterId: 5,                    // Landscape topic cluster
    colorClusterId: 7,                    // Warm colors cluster
    tagNames: ['nature', 'sunset', 'tree'],
    colorSimilarity: {
      red: 0.9,                           // High red for sunset
      green: 0.4,                         // Medium green
      blue: 0.2,                          // Low blue
      saturation: 0.8,                    // High saturation
      limit: 50
    },
    searchTerm: 'landscape',
    ordering: '-avg_brightness'           // Order by brightness descending
  });
  
  console.log(`Found ${results.length} sunset landscape postcards`);
  return results;
};
```

### Example 4: Interactive Filter Builder

This example shows how to build a dynamic filter based on user selections:

```javascript
// Dynamic filter builder for user interface
const buildDynamicFilter = (userSelections) => {
  const filters = {};
  
  // Add filters based on user selections
  if (userSelections.topicCluster) {
    filters['topic_cluster__cluster_id'] = userSelections.topicCluster;
  }
  
  if (userSelections.colorCluster) {
    filters['color_cluster__cluster_id'] = userSelections.colorCluster;
  }
  
  if (userSelections.selectedTags && userSelections.selectedTags.length > 0) {
    filters['tags__name'] = userSelections.selectedTags;
  }
  
  if (userSelections.searchTerm) {
    filters['search'] = userSelections.searchTerm;
  }
  
  if (userSelections.colorPicker) {
    // If user selected a color, use color similarity
    const { red, green, blue, saturation } = userSelections.colorPicker;
    return {
      colorSimilarity: { red, green, blue, saturation, limit: 30 },
      additionalFilters: filters
    };
  }
  
  return filters;
};

// Usage in a React component
const FilterComponent = () => {
  const [userSelections, setUserSelections] = useState({});
  const [results, setResults] = useState([]);
  
  const handleFilter = async () => {
    const filters = buildDynamicFilter(userSelections);
    
    if (filters.colorSimilarity) {
      // Handle color similarity case
      const results = await filterColorSimilarByTags(
        filters.colorSimilarity.red,
        filters.colorSimilarity.green,
        filters.colorSimilarity.blue,
        filters.colorSimilarity.saturation,
        filters.additionalFilters['tags__name'] || []
      );
      setResults(results);
    } else {
      // Handle regular filtering
      const results = await fetchPostcards(filters);
      setResults(results.data);
    }
  };
  
  return (
    <div>
      {/* Filter UI components */}
      <button onClick={handleFilter}>Apply Filters</button>
      <div>Found {results.length} postcards</div>
    </div>
  );
};
```

## Combined Filtering Examples

### Filter Postcards by Multiple Criteria

```javascript
// Filter by selected topic cluster and search term
const filterPostcards = async (selectedTopicCluster, searchTerm) => {
  const filters = {};
  
  if (selectedTopicCluster) {
    filters['topic_cluster__cluster_id'] = selectedTopicCluster;
  }
  
  if (searchTerm) {
    filters['search'] = searchTerm;
  }
  
  const response = await fetchPostcards(filters);
  return response.data;
};

// Filter by color cluster and tags
const filterByColorAndTags = async (colorClusterId, tagNames) => {
  const filters = {
    'color_cluster__cluster_id': colorClusterId,
    'tags__name': tagNames
  };
  
  const response = await fetchPostcards(filters);
  return response.data;
};
```

## Performance Considerations

1. **Caching**: Consider implementing frontend caching for frequently accessed data
2. **Debouncing**: Implement debouncing for search inputs to avoid excessive API calls
3. **Pagination**: For large datasets, consider adding pagination support
4. **Indexing**: Ensure database indexes are in place for search fields

## Error Handling

```javascript
const handleApiCall = async (apiFunction, ...args) => {
  try {
    const response = await apiFunction(...args);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('No results found');
      return [];
    } else if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
      throw new Error('Server error occurred');
    } else {
      console.error('Network error:', error.message);
      throw new Error('Network error occurred');
    }
  }
};
```

## Backward Compatibility

The original `get_tags` endpoint is still available at `/api/tags/` for backward compatibility, but it's recommended to use the new ViewSet endpoints for better functionality and consistency. 