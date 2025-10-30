#!/bin/bash

# Production Test Script
# This script builds and tests the app in production mode locally

echo "🧪 Testing Production Build Locally"
echo "===================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    echo "Please create .env file with required variables"
    exit 1
fi

echo -e "${BLUE}Step 1: Building frontend...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend build failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend built successfully${NC}"
echo ""

echo -e "${BLUE}Step 2: Starting production server...${NC}"
echo "Setting NODE_ENV=production"
echo ""

# Kill any existing process on port 5001
lsof -ti:5001 | xargs kill -9 2>/dev/null

# Start server in production mode
export NODE_ENV=production
export PORT=5001

echo -e "${GREEN}🚀 Starting server on http://localhost:5001${NC}"
echo ""
echo "Available routes:"
echo "  - http://localhost:5001              (Home page)"
echo "  - http://localhost:5001/admin/login  (Admin login)"
echo "  - http://localhost:5001/api/health   (Health check)"
echo ""
echo -e "${BLUE}Press Ctrl+C to stop the server${NC}"
echo ""

node server/server.js
