# Documentation

Documentation for the Hanuman GPT website (multi-collection sacred texts).

## ⚡ Generate Complete Verse Content

**One command** to create image + audio + embeddings for any verse:

```bash
# Install verse-content-sdk
pip install verse-content-sdk

# Generate everything for a verse (image, audio, embeddings)
verse-generate \
  --collection sundar-kaand \
  --verse 5 \
  --verse-id chaupai_05 \
  --all \
  --theme modern-minimalist

# Output:
#   ✓ Image: images/sundar-kaand/modern-minimalist/chaupai-05.png
#   ✓ Audio: audio/sundar-kaand/chaupai_05_full.mp3 + chaupai_05_slow.mp3
#   ✓ Embeddings: Updated automatically
```

**Or use the Claude Skill** for fully automated workflow:
```
/verse-generator Create chaupai_05 for sundar-kaand
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
# Generate complete content for one verse (image + audio + embeddings)
verse-generate --collection sundar-kaand --verse 5 --verse-id chaupai_05 --all --theme modern-minimalist
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

See [verse-content-sdk](https://github.com/sanatan-learnings/verse-content-sdk) for full SDK documentation.

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
- 📦 [verse-content-sdk](https://github.com/sanatan-learnings/verse-content-sdk)
- 🐙 [GitHub Repository](https://github.com/sanatan-learnings/hanuman-gpt)
