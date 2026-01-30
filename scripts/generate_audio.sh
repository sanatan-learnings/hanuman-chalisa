#!/bin/bash
# Wrapper script for generating audio pronunciations using Eleven Labs

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
RESUME="${RESUME:-}"
ONLY=""
REGENERATE=""
VOICE_ID=""

# Show usage
show_usage() {
    echo -e "${BLUE}Hanuman Chalisa Audio Generator${NC}"
    echo ""
    echo "Usage: ./scripts/generate_audio.sh [options]"
    echo ""
    echo "Options:"
    echo "  --only <filename>               Generate only one specific file (e.g., doha_01_full.mp3)"
    echo "  --regenerate <file1,file2>      Regenerate specific files (comma-separated)"
    echo "  -r, --resume <filename>         Resume from specific file (e.g., verse_15_full.mp3)"
    echo "  -v, --voice-id <id>             Eleven Labs voice ID (default: Rachel - 21m00Tcm4TlvDq8ikWAM)"
    echo "  -h, --help                      Show this help message"
    echo ""
    echo "Examples:"
    echo "  # Generate all audio files"
    echo "  ./scripts/generate_audio.sh"
    echo ""
    echo "  # Test with single file"
    echo "  ./scripts/generate_audio.sh --only doha_01_full.mp3"
    echo ""
    echo "  # Regenerate specific failed files"
    echo "  ./scripts/generate_audio.sh --regenerate doha_01_full.mp3,verse_10_slow.mp3"
    echo ""
    echo "  # Resume from specific file"
    echo "  ./scripts/generate_audio.sh --resume verse_15_full.mp3"
    echo ""
    echo "  # Use different voice"
    echo "  ./scripts/generate_audio.sh --voice-id YOUR_VOICE_ID"
    echo ""
    echo "Output:"
    echo "  86 MP3 files (43 verses × 2 speeds: full and slow)"
    echo "  Saved to: audio/ directory"
    echo ""
    echo "Cost Estimates:"
    echo "  Eleven Labs pricing varies by plan"
    echo "  Approximately 10,000-15,000 characters total"
    echo "  Free tier: 10,000 characters/month"
    echo ""
    echo "API Key:"
    echo "  Set ELEVENLABS_API_KEY environment variable or create .env file"
    echo "  Get your key from: https://elevenlabs.io/app/settings/api-keys"
    exit 0
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_usage
            ;;
        --only)
            ONLY="$2"
            shift 2
            ;;
        --regenerate)
            REGENERATE="$2"
            shift 2
            ;;
        -r|--resume)
            RESUME="$2"
            shift 2
            ;;
        -v|--voice-id)
            VOICE_ID="$2"
            shift 2
            ;;
        -*)
            echo -e "${RED}Error: Unknown option: $1${NC}"
            echo "Use --help for usage information"
            exit 1
            ;;
        *)
            echo -e "${RED}Error: Unexpected argument: $1${NC}"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: python3 not found${NC}"
    echo "Please install Python 3.8 or higher"
    exit 1
fi

# Check if required packages are installed
if ! python3 -c "import elevenlabs" 2>/dev/null; then
    echo -e "${YELLOW}Installing required packages...${NC}"
    pip3 install -r "$SCRIPT_DIR/requirements.txt" || {
        echo -e "${RED}Error: Failed to install dependencies${NC}"
        echo "Try running: pip3 install elevenlabs python-dotenv"
        exit 1
    }
fi

# Check for API key
if [ -z "$ELEVENLABS_API_KEY" ]; then
    if [ -f "$PROJECT_DIR/.env" ]; then
        echo -e "${GREEN}Loading API key from .env file${NC}"
        export $(grep -v '^#' "$PROJECT_DIR/.env" | xargs)
    else
        echo -e "${RED}Error: ELEVENLABS_API_KEY not set${NC}"
        echo ""
        echo "Set your API key by either:"
        echo "  1. export ELEVENLABS_API_KEY='your-key-here'"
        echo "  2. Create .env file with: ELEVENLABS_API_KEY=your-key-here"
        echo ""
        echo "Get your API key from: https://elevenlabs.io/app/settings/api-keys"
        exit 1
    fi
fi

echo -e "${GREEN}🎙️  Generating audio files for Hanuman Chalisa${NC}"
[ -n "$ONLY" ] && echo "Mode: Generate single file ($ONLY)"
[ -n "$REGENERATE" ] && echo "Mode: Regenerate specific files ($REGENERATE)"
[ -n "$RESUME" ] && echo "Resume from: $RESUME"
[ -n "$VOICE_ID" ] && echo "Voice ID: $VOICE_ID"
echo ""

# Build command
CMD=(python3 "$SCRIPT_DIR/generate_audio.py")

if [ -n "$ONLY" ]; then
    CMD+=(--only "$ONLY")
fi

if [ -n "$REGENERATE" ]; then
    CMD+=(--regenerate "$REGENERATE")
fi

if [ -n "$RESUME" ]; then
    CMD+=(--start-from "$RESUME")
fi

if [ -n "$VOICE_ID" ]; then
    CMD+=(--voice-id "$VOICE_ID")
fi

# Run the generation
echo -e "${YELLOW}Running: ${CMD[*]}${NC}"
echo ""

"${CMD[@]}"

echo ""
echo -e "${GREEN}✓ Generation complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Review audio files in: audio/"
echo "  2. Update _layouts/verse.html to add audio players"
echo "  3. Test with: jekyll serve"
echo "  4. Commit and push"
