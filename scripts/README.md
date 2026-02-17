# Content Generation Scripts

This directory contains configuration files for generating multimedia content for Hanuman Chalisa using the [sanatan-verse-sdk](https://github.com/sanatan-learnings/sanatan-verse-sdk).

## 📦 What's in This Directory

All content generation is now handled by the **sanatan-verse-sdk** CLI tools:

- **verse-embeddings** - Generate vector embeddings for semantic search
- **verse-audio** - Generate audio pronunciations using ElevenLabs
- **verse-images** - Generate AI images using DALL-E 3
- **verse-deploy** - Deploy Cloudflare Workers

### Legacy Scripts

Old scripts have been moved to `scripts/legacy/` for reference:
- Python scripts: `generate_embeddings.py`, `generate_audio.py`, `generate_theme_images.py`, etc.
- Shell wrappers: `generate_audio.sh`, `generate_images.sh` (replaced by SDK commands)

## ⚡ Quick Start

### 1. Install the SDK

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install SDK
pip install sanatan-verse-sdk
```

Or use the provided requirements.txt:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r scripts/requirements.txt
```

### 2. Set API Keys

Create a `.env` file in the project root:
```bash
# OpenAI API (for embeddings and images)
OPENAI_API_KEY=sk-your-key-here

# Eleven Labs API (for audio)
ELEVENLABS_API_KEY=your-key-here
```

Get your API keys:
- OpenAI: https://platform.openai.com/api-keys
- Eleven Labs: https://eu.residency.elevenlabs.io/app/developers/api-keys

## 🎨 Generate Images

```bash
# Generate using theme YAML settings
verse-images --theme-name modern-minimalist

# Generate with custom style
verse-images --theme-name watercolor --style "soft watercolor painting style"

# HD quality (2x cost)
verse-images --theme-name modern-minimalist --quality hd

# Resume from specific image
verse-images --theme-name my-theme --start-from verse-15.png

# Regenerate specific failed images
verse-images --theme-name my-theme --regenerate verse-10.png,verse-25.png

# Force regenerate ALL images (with confirmation)
verse-images --theme-name my-theme --force
```

**Cost Estimates:**
- Standard: 47 images × $0.040 = $1.88
- HD: 47 images × $0.080 = $3.76

**All Options:**
```
--theme-name TEXT       Theme name (required)
--style TEXT            Custom style description
--quality {standard,hd} Image quality (default: standard)
--size TEXT             Image size (default: 1024x1792)
--start-from TEXT       Resume from specific file
--regenerate TEXT       Comma-separated files to regenerate
--force                 Delete and regenerate ALL (asks for confirmation)
```

## 🎙️ Generate Audio

```bash
# Generate all audio files
verse-audio

# Test with single file
verse-audio --only doha_01_full.mp3

# Regenerate specific files
verse-audio --regenerate doha_01_full.mp3,verse_10_slow.mp3

# Resume from specific file
verse-audio --start-from verse_15_full.mp3

# Force regenerate ALL (with confirmation)
verse-audio --force
```

**Output:** 86 MP3 files (43 verses × 2 speeds: full and slow)

**All Options:**
```
--only TEXT         Generate only one file
--start-from TEXT   Resume from specific file
--regenerate TEXT   Comma-separated files to regenerate
--voice-id TEXT     Eleven Labs voice ID (default: Rachel)
--force             Delete and regenerate ALL (asks for confirmation)
```

## 🔍 Generate Embeddings

```bash
# Using OpenAI (default)
verse-embeddings

# Using local models (free, no API key needed)
verse-embeddings --provider huggingface

# With custom paths
verse-embeddings --verses-dir _verses --output data/embeddings.json
```

**Providers:**
- `openai` - Uses OpenAI API (fast, small cost ~$0.01)
- `huggingface` - Uses local sentence-transformers (free, slower first run)

**All Options:**
```
--provider {openai,huggingface}  Embedding provider (default: openai)
--verses-dir TEXT                Verse files directory (default: _verses)
--output TEXT                    Output file (default: data/embeddings.json)
```

## 🚀 Deploy Cloudflare Worker

```bash
verse-deploy
```

The deployment script will:
1. Check for Node.js and Wrangler CLI
2. Authenticate with Cloudflare
3. Deploy the worker
4. Set the OPENAI_API_KEY secret
5. Test the deployment

## 📂 Directory Structure

```
scripts/
├── README.md                    # This file
├── requirements.txt             # SDK installation
├── embedding_config.yaml        # Embedding configuration
└── legacy/                      # Old scripts (for reference)
    ├── generate_embeddings.py
    ├── generate_embeddings_local.py
    ├── generate_audio.py
    ├── generate_audio.sh           # Shell wrapper (replaced by verse-audio)
    ├── generate_theme_images.py
    ├── generate_images.sh          # Shell wrapper (replaced by verse-images)
    ├── deploy-cloudflare-worker.sh
    └── README-deploy-worker.md
```

## 🔧 Common Workflows

### Create a New Image Theme

```bash
# 1. Generate images with custom style
verse-images --theme-name my-theme --style "artistic style description"

# 2. Review images
open images/my-theme/

# 3. If some failed, regenerate specific ones
verse-images --theme-name my-theme --regenerate verse-10.png,verse-25.png

# 4. Update Jekyll config
# Edit _data/themes.yml to add your theme

# 5. Test locally
jekyll serve
```

### Regenerate Audio After Voice Change

```bash
# Delete all and regenerate with new voice
verse-audio --force --voice-id NEW_VOICE_ID
```

### Update Embeddings After Content Changes

```bash
# Regenerate embeddings (fast with OpenAI)
verse-embeddings

# Or use local models (free)
verse-embeddings --provider huggingface
```

## 📚 Documentation

- [Adding Themes](../docs/adding-themes.md)
- [Image Prompts](../docs/image-prompts.md)
- [sanatan-verse-sdk](https://github.com/sanatan-learnings/sanatan-verse-sdk)
- [OpenAI API](https://platform.openai.com/docs)
- [Eleven Labs API](https://elevenlabs.io/docs)

## 🔧 Troubleshooting

### SDK not installed

```bash
# Create and activate venv
python3 -m venv venv
source venv/bin/activate

# Install SDK
pip install sanatan-verse-sdk

# Verify installation
verse-audio --help
verse-images --help
verse-embeddings --help
```

### API key errors

```bash
# Check your .env file
cat .env

# Set keys manually
export OPENAI_API_KEY='sk-your-key-here'
export ELEVENLABS_API_KEY='your-key-here'
```

### Force regeneration safety

All `--force` options ask for confirmation before deleting files:
```
⚠️  WARNING: Force regeneration will delete 86 existing audio files!
Are you sure you want to delete and regenerate ALL audio files? (y/n):
```

Type `y` or `yes` to confirm, anything else to abort.

### Rate limits

The SDK includes automatic retry with exponential backoff. For free tier accounts, you may need to wait between generations.

## 💡 Tips

1. **Test First**: Use `--only` to generate one file first to verify setup
2. **Use Theme YAML**: Store style settings in `data/themes/<theme>.yml`
3. **Resume on Failure**: Use `--start-from` to continue interrupted generations
4. **Check Costs**: Review API pricing before generating large batches
5. **Regenerate Selectively**: Use `--regenerate` for specific files instead of `--force`

## 🆕 What Changed

The shell wrapper scripts (`generate_audio.sh`, `generate_images.sh`) have been **deprecated** and moved to `legacy/`. All their functionality is now in the SDK commands:

**Before:**
```bash
./scripts/generate_audio.sh --force
./scripts/generate_images.sh modern-minimalist --quality hd
```

**Now:**
```bash
verse-audio --force
verse-images --theme-name modern-minimalist --quality hd
```

The SDK commands provide:
- ✅ All shell wrapper features (--force, --regenerate)
- ✅ Interactive confirmations for destructive operations
- ✅ Better error messages and validation
- ✅ Cross-platform support (works on Windows, Mac, Linux)
- ✅ Easier to maintain and test

---

**Last Updated**: January 2026
