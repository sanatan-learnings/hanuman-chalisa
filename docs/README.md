# Documentation

Documentation for the Hanuman GPT website (multi-collection sacred texts).

## ⚡ Generate Complete Verse Content

**One command** to create image + audio + embeddings for any verse:

```bash
# Install sanatan-verse-sdk 0.27.0+
pip install --upgrade sanatan-verse-sdk

# Auto-detect and generate next verse
verse-generate \
  --collection sundar-kaand \
  --next \
  --regenerate-content \
  --auto-generate-scene

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
│   ├── adding-a-collection.md   # Add a new normative text end-to-end (source → publish)
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
verse-generate --collection sundar-kaand --verse 5 --theme modern-minimalist
```

### Batch Operations

```bash
# Generate OpenAI embeddings for all collections
verse-embeddings --multi-collection \
  --provider openai \
  --collections-file _data/collections.yml \
  --output-dir data/embeddings/providers/openai/collections

# Generate Bedrock Cohere embeddings for all collections
unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN AWS_DEFAULT_PROFILE AWS_DEFAULT_REGION
export AWS_PROFILE=default AWS_REGION=us-east-1
verse-embeddings --multi-collection \
  --provider bedrock-cohere \
  --collections-file _data/collections.yml \
  --output-dir data/embeddings/providers/bedrock-cohere-embed-multilingual-v3/collections

# Generate Hugging Face multilingual embeddings for all collections
verse-embeddings --multi-collection \
  --provider huggingface \
  --model sentence-transformers/paraphrase-multilingual-mpnet-base-v2 \
  --collections-file _data/collections.yml \
  --output-dir data/embeddings/providers/huggingface-paraphrase-multilingual-mpnet-base-v2/collections

# Generate all images for a collection/theme
verse-images --collection hanuman-chalisa --theme modern-minimalist

# Generate all audio for a collection
verse-audio --collection hanuman-chalisa
```

### Runtime Provider Switch

See [Embedding Provider Switching](guides/embedding-provider-switching.md) for:
- provider-specific generation commands
- `_data/embeddings.yml` runtime config values
- validation checklist

### Commands

- `verse-generate` - Orchestrate complete multimedia generation (images + audio) for verses
- `verse-fetch-text` - Fetch traditional Devanagari text from authoritative web sources
- `verse-embeddings` - Generate embeddings for semantic search (supports `--multi-collection`)
- `verse-images` - Generate images using gpt-image-1
- `verse-audio` - Generate audio using ElevenLabs
- `verse-deploy` - Deploy Cloudflare Worker

See [sanatan-verse-sdk](https://github.com/sanatan-learnings/sanatan-verse-sdk) for full SDK documentation.

## Guides

- **[Local Development](guides/local-development.md)** - Setup and run locally
- **[Content Generation](guides/content-generation.md)** - Create verses and media
- **[Cloudflare Worker](guides/cloudflare-worker-setup.md)** - Deploy API proxy
- **[Embedding Provider Switching](guides/embedding-provider-switching.md)** - OpenAI/Bedrock/Hugging Face setup and runtime switching

## Reference

- **[Tech Stack](reference/tech-stack.md)** - Architecture and YAML structure
- **[Image Prompts](reference/image-prompts.md)** - Scene descriptions
- **[Background](reference/background.md)** - About Hanuman Chalisa
- **[Book Generation](reference/book-generation.md)** - PDF/print books
- **[Spiritual Guidance](reference/spiritual-guidance.md)** - RAG system
- **[Multilingual](reference/multilingual.md)** - Internationalization
- **[Themes](themes/)** - Visual style configurations

## Quick Links

- 🌐 [Live Website](https://hanumanji.ai/)
- 📦 [sanatan-verse-sdk](https://github.com/sanatan-learnings/sanatan-verse-sdk)
- 🐙 [GitHub Repository](https://github.com/sanatan-learnings/hanuman-gpt)
