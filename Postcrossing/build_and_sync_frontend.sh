#!/bin/bash

# Define paths
FRONTEND_DIR=frontend
BUILD_DIR=$FRONTEND_DIR/build
TARGET_DIR=backend/static/frontend

echo "Checking dependencies..."
cd $FRONTEND_DIR

# Run npm install if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "node_modules not found. Running npm install..."
    npm install

    if [ $? -ne 0 ]; then
        echo "npm install failed. Aborting."
        exit 1
    fi
fi

echo "Building React frontend..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "Build failed. Aborting."
    exit 1
fi

echo "Build successful. Syncing files..."

# Remove old frontend static files
cd ..
rm -rf $TARGET_DIR/*
mkdir -p $TARGET_DIR

# Move new build to Django static folder
mv $BUILD_DIR/* $TARGET_DIR/

echo "Frontend updated in $TARGET_DIR"
