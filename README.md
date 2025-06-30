# Postcrossing Visual Analytics Platform

A comprehensive web application for exploring and analyzing postcard data through interactive visualizations, advanced filtering, and machine learning-powered recommendations.
Created for the Course Knowledge discovery and data mining 1 as group 54.

## 🎯 Features

- **Interactive Postcard Browser** - Explore postcards with advanced filtering and search
- **Smart Tag System** - AI-powered tagging with lemmatization for better search
- **Color Similarity Search** - Find postcards with similar color palettes
- **Cluster-based Organization** - Topic and color clustering for intuitive navigation
- **Country-based Filtering** - Filter postcards by country with automatic tagging
- **Real-time Search** - Search across tags, titles, and cluster labels
- **Responsive Design** - Modern UI that works on desktop and mobile

## 🏗️ Architecture

- **Backend**: Django REST Framework
- **Frontend**: React.js with modern UI components
- **Data Processing**: Pandas for data manipulation and analysis
- **Machine Learning**: Clustering algorithms for topic and color organization

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+**
- **Node.js 16+** and npm
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd VisualAnalytics_50_postcrossing
```

### 2. Backend Setup

```bash
# Navigate to the Postcrossing directory
cd Postcrossing

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Set up the database
python manage.py makemigrations
python manage.py migrate

# Load postcard data (this may take a few minutes)
python manage.py load_postcards
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Build the frontend for production
npm run build
```

### 4. Sync Frontend to Backend

```bash
# Return to Postcrossing directory
cd ..

# Use the Django command
python manage.py build_frontend

# Or use the automated script (Unix/Linux/macOS)
chmod +x build_and_sync_frontend.sh
./build_and_sync_frontend.sh

# Or manually:
# 1. Copy frontend/build/* to backend/static/frontend/
# 2. Ensure backend/static/frontend/ exists
```

### 5. Run the Application

```bash
# Start the Django development server
python manage.py runserver

# Open your browser and navigate to:
# http://localhost:8000
```

## 📁 Project Structure

```
VisualAnalytics_50_postcrossing/
├── Postcrossing/
│   ├── backend/                 # Django backend
│   │   ├── api/                # REST API endpoints
│   │   ├── static/frontend/    # Built React frontend
│   │   └── manage.py           # Django management
│   ├── frontend/               # React frontend
│   │   ├── src/               # React source code
│   │   ├── public/            # Static assets
│   │   └── package.json       # Node.js dependencies
│   ├── data/                  # Postcard data and images
│   └── build_and_sync_frontend.sh  # Frontend build script
├── requirements.txt           # Python dependencies
└── README.md                 # This file
```

## 🔧 Development Setup

### Backend Development

```bash
cd Postcrossing/backend

# Run Django development server
python manage.py runserver

# Run with debug output
python manage.py runserver --verbosity=2
```

### Frontend Development

```bash
cd Postcrossing/frontend

# Start React development server
npm start

# The frontend will be available at http://localhost:3000
# Note: You'll need to configure CORS or proxy for API calls
```

### Database Management

```bash
# Load postcards (with debug output optional)
python manage.py load_postcards --debug

# Clear all postcards
python manage.py clear_postcards

# Create a superuser for admin access
python manage.py createsuperuser
```

## 🎨 Key Features Explained

### Smart Tagging System
- **Automatic Tagging**: Postcards are automatically tagged based on content analysis
- **Country Tags**: Automatic country tagging (e.g., "Country-UK", "Country-US")

### Advanced Filtering
- **Multi-criteria Filtering**: Combine topic clusters, color clusters, and tags
- **Color Similarity**: Find postcards with similar color palettes
- **Real-time Search**: Search across all postcard attributes

### Cluster Organization
- **Topic Clusters**: Group postcards by content themes (Landscape, Portrait, etc.)
- **Color Clusters**: Group by dominant color palettes (Warm Tones, Cool Tones, etc.)

## 📚 API Documentation

For detailed API documentation, see [BACKEND_API_DOCUMENTATION.md](Postcrossing/BACKEND_API_DOCUMENTATION.md)

### Quick API Examples

```javascript
// Search for tags
const tags = await searchTags('blue');

// Filter by country and topic
const ukLandscapes = await fetchPostcards({
  'tags__name': ['Country-UK', 'landscape'],
  'topic_cluster__cluster_id': 5
});

// Find color similar postcards
const similarColors = await fetchColorSimilarPostcards({
  red: 0.9, green: 0.4, blue: 0.2, saturation: 0.8
});
```

## 🛠️ Troubleshooting

### Common Issues

**Frontend build fails:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Database migration errors:**
```bash
# Reset migrations (WARNING: This will delete data)
python manage.py migrate api zero
python manage.py makemigrations
python manage.py migrate
```

**Postcard loading issues:**
```bash
# Check if data files exist
ls Postcrossing/data/

# Run with debug output
python manage.py load_postcards --debug
```

**Permission errors on Unix:**
```bash
# Make build script executable
chmod +x build_and_sync_frontend.sh
```

### Environment Variables

Create a `.env` file in the backend directory for custom configuration:

```env
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost/dbname
REACT_APP_API_URL=http://localhost:8000/api
```