#!/bin/bash

# Verse Creation Automation Script
# Usage: ./scripts/create-verse.sh <collection> <verse_id>
# Example: ./scripts/create-verse.sh sundar-kaand chaupai_05

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if required arguments are provided
if [ $# -lt 2 ]; then
    echo -e "${RED}Error: Missing required arguments${NC}"
    echo "Usage: $0 <collection> <verse_id>"
    echo "Example: $0 sundar-kaand chaupai_05"
    exit 1
fi

COLLECTION=$1
VERSE_ID=$2
PROJECT_ROOT="$(pwd)"
SDK_PATH="/Users/arungupta/workspaces/verse-content-sdk/.venv/bin"

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Verse Creation Automation${NC}"
echo -e "${BLUE}================================${NC}"
echo -e "Collection: ${GREEN}${COLLECTION}${NC}"
echo -e "Verse ID: ${GREEN}${VERSE_ID}${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if [ ! -f ".env" ]; then
    echo -e "${RED}Error: .env file not found${NC}"
    echo "Please create .env with OPENAI_API_KEY and ELEVENLABS_API_KEY"
    exit 1
fi

if [ ! -f "${SDK_PATH}/verse-generate" ]; then
    echo -e "${RED}Error: verse-content-sdk not found at ${SDK_PATH}${NC}"
    exit 1
fi

# Check if verse file already exists
VERSE_FILE="_verses/${COLLECTION}/${VERSE_ID}.md"
if [ -f "${VERSE_FILE}" ]; then
    echo -e "${YELLOW}Warning: Verse file already exists: ${VERSE_FILE}${NC}"
    read -p "Do you want to continue and regenerate multimedia? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
    SKIP_VERSE_CREATION=true
else
    SKIP_VERSE_CREATION=false
fi

# Step 1: Create verse file (if needed)
if [ "$SKIP_VERSE_CREATION" = false ]; then
    echo -e "${YELLOW}Step 1: Creating verse file...${NC}"
    echo -e "${RED}Please use Claude Code to create the verse file manually:${NC}"
    echo -e "  File: ${VERSE_FILE}"
    echo -e "  Include: Devanagari, transliteration, meanings, translations, story, etc."
    echo ""
    read -p "Press Enter when verse file is created..."

    if [ ! -f "${VERSE_FILE}" ]; then
        echo -e "${RED}Error: Verse file not created${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Verse file created${NC}"
else
    echo -e "${GREEN}✓ Using existing verse file${NC}"
fi

# Step 2: Check/Add scene description
echo -e "${YELLOW}Step 2: Scene description...${NC}"
SCENE_FILE="docs/image-prompts/${COLLECTION}.md"
if [ ! -f "${SCENE_FILE}" ]; then
    echo -e "${RED}Error: Image prompts file not found: ${SCENE_FILE}${NC}"
    exit 1
fi

echo -e "${RED}Please ensure scene description is added to:${NC}"
echo -e "  File: ${SCENE_FILE}"
echo -e "  Format: ### Verse N: Title + Scene Description"
echo ""
read -p "Press Enter when scene description is added..."
echo -e "${GREEN}✓ Scene description ready${NC}"

# Step 3: Generate multimedia
echo -e "${YELLOW}Step 3: Generating multimedia (image + audio)...${NC}"
source .env
set -a
source .env
set +a

${SDK_PATH}/verse-generate \
  --collection "${COLLECTION}" \
  --verse "${VERSE_ID}" \
  --all \
  --theme modern-minimalist

echo -e "${GREEN}✓ Multimedia generated${NC}"

# Step 4: Check and fix image naming
echo -e "${YELLOW}Step 4: Verifying image naming...${NC}"
IMAGE_DIR="images/${COLLECTION}/modern-minimalist"

# Look for the generated image (might be verse-NN.png or actual verse_id)
EXPECTED_IMAGE="${IMAGE_DIR}/${VERSE_ID}.png"
GENERATED_IMAGE=$(ls ${IMAGE_DIR}/*$(echo ${VERSE_ID} | grep -oE '[0-9]+')*.png 2>/dev/null | tail -1)

if [ -n "${GENERATED_IMAGE}" ] && [ "${GENERATED_IMAGE}" != "${EXPECTED_IMAGE}" ]; then
    echo -e "${YELLOW}Renaming image to match convention${NC}"
    mv "${GENERATED_IMAGE}" "${EXPECTED_IMAGE}"
    echo -e "${GREEN}✓ Image renamed: ${EXPECTED_IMAGE}${NC}"
else
    echo -e "${GREEN}✓ Image naming correct${NC}"
fi

# Step 5: Update embeddings
echo -e "${YELLOW}Step 5: Regenerating embeddings...${NC}"
${SDK_PATH}/verse-embeddings \
  --multi-collection \
  --collections-file _data/collections.yml \
  --verses-dir _verses \
  --output data/embeddings.json

echo -e "${GREEN}✓ Embeddings updated${NC}"

# Step 6: Verify generated files
echo -e "${YELLOW}Step 6: Verifying generated files...${NC}"
echo ""
echo -e "Verse file: ${GREEN}✓${NC} ${VERSE_FILE}"

if [ -f "${EXPECTED_IMAGE}" ]; then
    IMAGE_SIZE=$(du -h "${EXPECTED_IMAGE}" | cut -f1)
    echo -e "Image: ${GREEN}✓${NC} ${EXPECTED_IMAGE} (${IMAGE_SIZE})"
else
    echo -e "Image: ${RED}✗${NC} Not found"
fi

AUDIO_FULL="audio/${COLLECTION}/${VERSE_ID}_full.mp3"
AUDIO_SLOW="audio/${COLLECTION}/${VERSE_ID}_slow.mp3"

if [ -f "${AUDIO_FULL}" ]; then
    AUDIO_SIZE=$(du -h "${AUDIO_FULL}" | cut -f1)
    echo -e "Audio (full): ${GREEN}✓${NC} ${AUDIO_FULL} (${AUDIO_SIZE})"
else
    echo -e "Audio (full): ${RED}✗${NC} Not found"
fi

if [ -f "${AUDIO_SLOW}" ]; then
    AUDIO_SIZE=$(du -h "${AUDIO_SLOW}" | cut -f1)
    echo -e "Audio (slow): ${GREEN}✓${NC} ${AUDIO_SLOW} (${AUDIO_SIZE})"
else
    echo -e "Audio (slow): ${RED}✗${NC} Not found"
fi

echo -e "Embeddings: ${GREEN}✓${NC} data/embeddings.json"
echo ""

# Step 7: Update navigation (previous verse)
echo -e "${YELLOW}Step 7: Update navigation links...${NC}"
echo -e "${RED}Please update the previous verse to link to this one:${NC}"
echo -e "  Find the previous verse file and set: next_verse: \"/${COLLECTION}/${VERSE_ID}\""
echo ""
read -p "Press Enter when navigation is updated..."
echo -e "${GREEN}✓ Navigation updated${NC}"

# Summary
echo ""
echo -e "${BLUE}================================${NC}"
echo -e "${GREEN}✓ Verse creation complete!${NC}"
echo -e "${BLUE}================================${NC}"
echo ""
echo -e "Test locally:"
echo -e "  ${BLUE}bundle exec jekyll serve${NC}"
echo -e "  http://localhost:4000/${COLLECTION}/${VERSE_ID}/"
echo ""
echo -e "To commit:"
echo -e "  ${BLUE}git add _verses/${COLLECTION}/${VERSE_ID}.md images/${COLLECTION}/ audio/${COLLECTION}/ docs/image-prompts/${COLLECTION}.md data/embeddings.json${NC}"
echo -e "  ${BLUE}git commit -m \"Add ${VERSE_ID} to ${COLLECTION} with multimedia\"${NC}"
echo -e "  ${BLUE}git push${NC}"
echo ""
