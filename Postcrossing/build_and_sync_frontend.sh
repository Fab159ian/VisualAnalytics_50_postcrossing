#!/bin/bash

# Define paths
FRONTEND_DIR=frontend
BUILD_DIR=$FRONTEND_DIR/build
TARGET_DIR=backend/static/frontend

echo "Building React frontend..."
cd $FRONTEND_DIR
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
