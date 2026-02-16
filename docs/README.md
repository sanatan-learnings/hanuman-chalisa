# Documentation

Documentation for the Hanuman GPT website (multi-collection sacred texts).

## ⚡ Generate Complete Verse Content

**One command** to create image + audio + embeddings for any verse:

```bash
# Install sanatan-sdk 0.20.4+
pip install sanatan-sdk

# Auto-detect and generate next verse
verse-generate \
  --collection sundar-kaand \
  --next \
  --regenerate-content \
  --auto-generate-scene \
  --all

# Output:
#   ✓ Verse: _verses/sundar-kaand/chaupai-20.md
#   ✓ Image: images/sundar-kaand/modern-minimalist/chaupai-20.png
#   ✓ Audio: audio/sundar-kaand/chaupai-20-full.mp3 + chaupai-20-slow.mp3
#   ✓ Scene: data/scenes/sundar-kaand.yml (auto-generated)
#   ✓ Embeddings: Updated automatically
```

See [Content Generation Guide](guides/content-generation.md) for complete documentation.

---

## Structure

```
docs/
├── guides/                      # Step-by-step how-to guides
│   ├── local-development.md     # Setup and running locally
│   ├── content-generation.md    # Creating verses and media
│   └── cloudflare-worker-setup.md # API proxy deployment
├── reference/                   # Reference material
│   ├── tech-stack.md            # Technical architecture
│   ├── background.md            # About Hanuman Chalisa
│   ├── book-generation.md       # PDF/print book generation
│   ├── spiritual-guidance.md    # RAG system
│   └── multilingual.md          # Internationalization
├── themes/                      # Image theme configurations
└── image-prompts/               # Scene descriptions for image generation
```

## Quick Start

### Generate Single Verse (Recommended)

```bash
# Generate complete content for one verse (verse ID auto-detected from existing files)
verse-generate --collection sundar-kaand --verse 5 --all --theme modern-minimalist
```

### Batch Operations

```bash
# Generate embeddings for all collections
verse-embeddings --multi-collection \
  --collections-file _data/collections.yml \
  --verses-dir _verses \
  --output data/embeddings.json

# Generate all images for a collection/theme
verse-images --collection hanuman-chalisa --theme modern-minimalist

# Generate all audio for a collection
verse-audio --collection hanuman-chalisa
```

### Commands

- `verse-generate` - Orchestrate complete multimedia generation (images + audio) for verses
- `verse-fetch-text` - Fetch traditional Devanagari text from authoritative web sources
- `verse-embeddings` - Generate embeddings for semantic search (supports `--multi-collection`)
- `verse-images` - Generate images using DALL-E 3
- `verse-audio` - Generate audio using ElevenLabs
- `verse-deploy` - Deploy Cloudflare Worker

**Claude Skill**: Use `/verse-generator` for automated verse creation workflow.

See [sanatan-sdk](https://github.com/sanatan-learnings/sanatan-sdk) for full SDK documentation.

## Guides

- **[Local Development](guides/local-development.md)** - Setup and run locally
- **[Content Generation](guides/content-generation.md)** - Create verses and media
- **[Cloudflare Worker](guides/cloudflare-worker-setup.md)** - Deploy API proxy

## Reference

- **[Tech Stack](reference/tech-stack.md)** - Architecture and YAML structure
- **[Image Prompts](reference/image-prompts.md)** - Scene descriptions
- **[Background](reference/background.md)** - About Hanuman Chalisa
- **[Book Generation](reference/book-generation.md)** - PDF/print books
- **[Spiritual Guidance](reference/spiritual-guidance.md)** - RAG system
- **[Multilingual](reference/multilingual.md)** - Internationalization
- **[Themes](themes/)** - Visual style configurations

## Quick Links

- 🌐 [Live Website](https://sanatan-learnings.github.io/hanuman-gpt/)
- 📦 [sanatan-sdk](https://github.com/sanatan-learnings/sanatan-sdk)
- 🐙 [GitHub Repository](https://github.com/sanatan-learnings/hanuman-gpt)
