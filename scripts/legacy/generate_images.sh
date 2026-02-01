#!/bin/bash
# Simple wrapper script for generating theme images

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
QUALITY="${QUALITY:-standard}"
SIZE="${SIZE:-1024x1024}"
RESUME="${RESUME:-}"
REGENERATE=""
FORCE=""
THEME_NAME=""
STYLE=""

# Show usage
show_usage() {
    echo -e "${BLUE}Hanuman Chalisa Image Theme Generator${NC}"
    echo ""
    echo "Usage: ./scripts/generate.sh <theme-name> [options]"
    echo ""
    echo "Arguments:"
    echo "  <theme-name>              Name of the theme (e.g., modern-minimalist, watercolor)"
    echo ""
    echo "Options:"
    echo "  -s, --style <description>     Custom style description (overrides theme YAML)"
    echo "  -q, --quality <level>         Image quality: 'standard' or 'hd' (default: from theme or standard)"
    echo "  --size <dimensions>           Image size: '1024x1024' or '1024x1792' (default: from theme or 1024x1024)"
    echo "  -r, --resume <filename>       Resume from specific image (e.g., verse-15.png)"
    echo "  --regenerate <file1,file2>    Regenerate specific images (comma-separated, e.g., verse-10.png,verse-25.png)"
    echo "  --force                       Force regenerate ALL images (deletes existing theme directory)"
    echo "  -h, --help                    Show this help message"
    echo ""
    echo "Theme YAML Files:"
    echo "  If a file exists at docs/themes/<theme-name>.yml, the script will"
    echo "  automatically read generation settings (style, quality, size) from it."
    echo "  Use --style, --quality, or --size to override theme defaults."
    echo ""
    echo "Examples:"
    echo "  # Generate using theme YAML settings (simplest)"
    echo "  ./scripts/generate_images.sh modern-minimalist"
    echo ""
    echo "  # Generate with custom style (no theme YAML)"
    echo "  ./scripts/generate_images.sh watercolor --style 'soft watercolor painting style'"
    echo ""
    echo "  # Override theme settings"
    echo "  ./scripts/generate_images.sh modern-minimalist -s 'different style' -q hd"
    echo ""
    echo "  # Resume interrupted generation"
    echo "  ./scripts/generate_images.sh traditional-art --resume verse-15.png"
    echo ""
    echo "  # Regenerate specific failed images"
    echo "  ./scripts/generate_images.sh kids-friendly --regenerate verse-10.png,verse-25.png"
    echo ""
    echo "  # Force regenerate ALL images (useful after updating character consistency)"
    echo "  ./scripts/generate_images.sh kids-friendly --force"
    echo ""
    echo "Cost Estimates (all 44 images):"
    echo "  Standard quality (1024x1024): ~\$1.76"
    echo "  HD quality (1024x1024):       ~\$3.52"
    echo ""
    echo "API Key:"
    echo "  Set OPENAI_API_KEY environment variable or create .env file"
    echo "  Get your key from: https://platform.openai.com/api-keys"
    exit 0
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_usage
            ;;
        -s|--style)
            STYLE="$2"
            shift 2
            ;;
        -q|--quality)
            QUALITY="$2"
            if [[ ! "$QUALITY" =~ ^(standard|hd)$ ]]; then
                echo -e "${RED}Error: Quality must be 'standard' or 'hd'${NC}"
                exit 1
            fi
            shift 2
            ;;
        --size)
            SIZE="$2"
            if [[ ! "$SIZE" =~ ^(1024x1024|1024x1792)$ ]]; then
                echo -e "${RED}Error: Size must be '1024x1024' or '1024x1792'${NC}"
                exit 1
            fi
            shift 2
            ;;
        -r|--resume)
            RESUME="$2"
            shift 2
            ;;
        --regenerate)
            REGENERATE="$2"
            shift 2
            ;;
        --force)
            FORCE="true"
            shift
            ;;
        -*)
            echo -e "${RED}Error: Unknown option: $1${NC}"
            echo "Use --help for usage information"
            exit 1
            ;;
        *)
            if [ -z "$THEME_NAME" ]; then
                THEME_NAME="$1"
            else
                echo -e "${RED}Error: Too many arguments${NC}"
                echo "Use --help for usage information"
                exit 1
            fi
            shift
            ;;
    esac
done

# Check if theme name is provided
if [ -z "$THEME_NAME" ]; then
    echo -e "${RED}Error: Theme name is required${NC}"
    echo ""
    show_usage
fi

# Check for conflicting options
if [ -n "$FORCE" ] && [ -n "$REGENERATE" ]; then
    echo -e "${RED}Error: Cannot use --force and --regenerate together${NC}"
    echo "Use --force to regenerate ALL images, or --regenerate for specific images"
    exit 1
fi

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: python3 not found${NC}"
    echo "Please install Python 3.8 or higher"
    exit 1
fi

# Check if verse-content-sdk is installed
if ! command -v verse-images &> /dev/null; then
    echo -e "${YELLOW}Installing verse-content-sdk...${NC}"
    pip3 install git+https://github.com/sanatan-learnings/verse-content-sdk.git || {
        echo -e "${RED}Error: Failed to install verse-content-sdk${NC}"
        echo "Try running: pip3 install git+https://github.com/sanatan-learnings/verse-content-sdk.git"
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

echo -e "${GREEN}🎨 Generating images for theme: $THEME_NAME${NC}"
echo "Style: ${STYLE:-default}"
echo "Quality: $QUALITY"
echo "Size: $SIZE"
[ -n "$RESUME" ] && echo "Resume from: $RESUME"
[ -n "$REGENERATE" ] && echo "Regenerate: $REGENERATE"
[ -n "$FORCE" ] && echo -e "${YELLOW}Mode: FORCE REGENERATE ALL${NC}"
echo ""

# Handle --force option (must come before --regenerate)
if [ -n "$FORCE" ]; then
    IMAGES_DIR="images/$THEME_NAME"

    if [ -d "$IMAGES_DIR" ]; then
        IMAGE_COUNT=$(ls -1 "$IMAGES_DIR"/*.png 2>/dev/null | wc -l)
        echo -e "${YELLOW}⚠ WARNING: Force regeneration will delete $IMAGE_COUNT existing images!${NC}"
        echo -e "${YELLOW}Theme directory: $IMAGES_DIR${NC}"
        echo ""
        read -p "Are you sure you want to delete and regenerate ALL images? (y/n): " CONFIRM

        # Convert to lowercase for comparison
        CONFIRM_LOWER=$(echo "$CONFIRM" | tr '[:upper:]' '[:lower:]')

        if [[ "$CONFIRM_LOWER" =~ ^(y|yes)$ ]]; then
            echo ""
            echo -e "${YELLOW}Deleting existing theme directory...${NC}"
            rm -rf "$IMAGES_DIR"
            echo -e "${GREEN}✓ Deleted: $IMAGES_DIR${NC}"
            echo -e "${YELLOW}Will now regenerate all 44 images...${NC}"
            echo ""
        else
            echo -e "${RED}Aborted. No images were deleted.${NC}"
            exit 0
        fi
    else
        echo -e "${YELLOW}Theme directory not found. Will create and generate all images.${NC}"
        echo ""
    fi
fi

# Handle --regenerate option
if [ -n "$REGENERATE" ]; then
    IMAGES_DIR="images/$THEME_NAME"
    if [ ! -d "$IMAGES_DIR" ]; then
        echo -e "${RED}Error: Theme directory not found: $IMAGES_DIR${NC}"
        exit 1
    fi

    echo -e "${YELLOW}Preparing to regenerate specific images...${NC}"
    IFS=',' read -ra FILES <<< "$REGENERATE"
    DELETED_COUNT=0

    for FILE in "${FILES[@]}"; do
        FILE=$(echo "$FILE" | xargs)  # Trim whitespace
        FILE_PATH="$IMAGES_DIR/$FILE"

        if [ -f "$FILE_PATH" ]; then
            rm "$FILE_PATH"
            echo -e "  ${GREEN}✓${NC} Deleted: $FILE"
            DELETED_COUNT=$((DELETED_COUNT + 1))
        else
            echo -e "  ${YELLOW}⚠${NC} Not found (will generate): $FILE"
        fi
    done

    echo ""
    if [ $DELETED_COUNT -gt 0 ]; then
        echo -e "${GREEN}Deleted $DELETED_COUNT existing image(s).${NC}"
    fi
    echo -e "${YELLOW}Will now regenerate missing images...${NC}"
    echo ""
fi

# Build command
CMD=("verse-images" "--theme-name" "$THEME_NAME" "--quality" "$QUALITY" "--size" "$SIZE")

if [ -n "$STYLE" ]; then
    CMD+=("--style" "$STYLE")
fi

if [ -n "$RESUME" ]; then
    CMD+=("--start-from" "$RESUME")
fi

# Run the generation
echo -e "${YELLOW}Running: ${CMD[*]}${NC}"
echo ""

"${CMD[@]}"

echo ""
echo -e "${GREEN}✓ Generation complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Review images in: images/$THEME_NAME/"
echo "  2. Update _data/themes.yml"
echo "  3. Test with: jekyll serve"
echo "  4. Commit and push"
