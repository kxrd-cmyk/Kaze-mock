#!/bin/bash

# Change to the dist directory
cd "$(dirname "$0")/dist"

# Deploy using wrangler deploy
echo "Deploying to Cloudflare Pages..."
npx wrangler deploy

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo "Deployment successful!"
else
    echo "Deployment failed. Check the error message above."
    exit 1
fi
