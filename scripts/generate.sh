#!/bin/bash
# Simple wrapper script for generating theme images

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: python3 not found${NC}"
    echo "Please install Python 3.8 or higher"
    exit 1
fi

# Check if required packages are installed
if ! python3 -c "import openai" 2>/dev/null; then
    echo -e "${YELLOW}Installing required packages...${NC}"
    pip3 install -r "$SCRIPT_DIR/requirements.txt" || {
        echo -e "${RED}Error: Failed to install dependencies${NC}"
        echo "Try running: pip3 install -r scripts/requirements.txt"
        exit 1
    }
fi

# Check for API key
if [ -z "$OPENAI_API_KEY" ]; then
    if [ -f "$PROJECT_DIR/.env" ]; then
        echo -e "${GREEN}Loading API key from .env file${NC}"
        export $(grep -v '^#' "$PROJECT_DIR/.env" | xargs)
    else
        echo -e "${RED}Error: OPENAI_API_KEY not set${NC}"
        echo ""
        echo "Set your API key by either:"
        echo "  1. export OPENAI_API_KEY='your-key-here'"
        echo "  2. Create .env file with: OPENAI_API_KEY=your-key-here"
        echo ""
        echo "Get your API key from: https://platform.openai.com/api-keys"
        exit 1
    fi
fi

# Show usage if no arguments
if [ $# -eq 0 ]; then
    echo "Usage: ./scripts/generate.sh <theme-name> [style-description]"
    echo ""
    echo "Examples:"
    echo "  ./scripts/generate.sh traditional-art"
    echo "  ./scripts/generate.sh watercolor 'soft watercolor painting style'"
    echo "  ./scripts/generate.sh pencil-sketch 'detailed pencil drawings'"
    echo ""
    echo "Options:"
    echo "  Set QUALITY=hd for HD quality (2x cost)"
    echo "  Set SIZE=1024x1792 for portrait images"
    echo ""
    echo "Resume interrupted generation:"
    echo "  RESUME=verse-15.png ./scripts/generate.sh traditional-art"
    exit 1
fi

THEME_NAME="$1"
STYLE="${2:-}"
QUALITY="${QUALITY:-standard}"
SIZE="${SIZE:-1024x1024}"
RESUME="${RESUME:-}"

echo -e "${GREEN}🎨 Generating images for theme: $THEME_NAME${NC}"
echo "Style: ${STYLE:-default}"
echo "Quality: $QUALITY"
echo "Size: $SIZE"
[ -n "$RESUME" ] && echo "Resume from: $RESUME"
echo ""

# Build command
CMD="python3 $SCRIPT_DIR/generate_theme_images.py --theme-name $THEME_NAME --quality $QUALITY --size $SIZE"

if [ -n "$STYLE" ]; then
    CMD="$CMD --style \"$STYLE\""
fi

if [ -n "$RESUME" ]; then
    CMD="$CMD --start-from $RESUME"
fi

# Run the generation
echo -e "${YELLOW}Running: $CMD${NC}"
echo ""

eval $CMD

echo ""
echo -e "${GREEN}✓ Generation complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Review images in: images/$THEME_NAME/"
echo "  2. Update _data/themes.yml"
echo "  3. Test with: jekyll serve"
echo "  4. Commit and push"
