# Technology Stack

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│         DEVELOPMENT ENVIRONMENT              │
├─────────────────────────────────────────────┤
│  OpenAI Codex / Claude Code (AI) │ PyCharm (Human Review) │
└──────────┬──────────┴──────────┬────────────┘
           │                     │
           ▼                     ▼
┌──────────────────────────────────────────────┐
│            CONTENT (YAML + Markdown)          │
├──────────────────────────────────────────────┤
│  • _verses/{collection}/*.md (verse files)   │
│  • data/verses/{collection}.yml (source)     │
│  • data/sources/*.txt (Puranic source texts) │
│  • data/puranic-index/*.yml (episode index)  │
└──────────────────┬───────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────┐
│           AI-GENERATED MEDIA ASSETS           │
├──────────────────────────────────────────────┤
│  • images/{collection}/{theme}/*.png         │
│  • audio/{collection}/*.mp3                  │
│  • data/embeddings/providers/{provider}/collections/*.json │
│  • data/embeddings/puranic/{source-key}.json │
└──────────────────┬───────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────┐
│       VERSION CONTROL & DEPLOYMENT           │
├──────────────────────────────────────────────┤
│  Git → GitHub → Jekyll Build → hanumanji.ai │
└──────────────────────────────────────────────┘
```

## Core Technologies

### Static Site Generation
- **Jekyll** (v4.x) - Ruby-based static site generator
- **GitHub Pages** - Hosting with automatic Jekyll builds
- **Custom domain** - hanumanji.ai
- **Liquid Templates** - Template engine for dynamic HTML generation

### Frontend
- **HTML5** - Semantic markup
- **Custom CSS** (`assets/css/hanuman.css`) - Responsive design with orange/saffron theme. Named `hanuman.css` (not `style.css`) to avoid being overwritten by the `jekyll-theme-primer` gem, which compiles its own `style.scss` → `style.css` at build time.
- **Vanilla JavaScript** - Arrow key navigation, language switching, flashcard view, audio playback; no frameworks

### Content Structure
- **YAML Front Matter** - All verse content structured as data
- **Markdown Files** - Each verse is a `.md` file with YAML front matter
- **Jekyll Collections** - `_verses/{collection}/` directories
- **Multi-Language Support** - English + Hindi with extensible architecture

## Development Tools

### PyCharm IDE
- Code editing and project management
- Visual git diff and merge tools
- Markdown preview with Devanagari support
- Embedded terminal for OpenAI Codex / Claude Code

### OpenAI Codex / Claude Code
- AI-assisted content generation via sanatan-verse-sdk
- Verse generation, puranic context, images, audio, embeddings
- Git workflow automation

### System Dependencies
- **Python 3.8+** with **venv** - For sanatan-verse-sdk (v0.42.0+)
- **ffmpeg** - Audio post-processing (`brew install ffmpeg`)
- **Ruby 3.3+** - For Jekyll local development

## Project Structure

```
hanuman-gpt/
├── _config.yml              # Jekyll configuration
├── _data/
│   ├── collections.yml      # Collection metadata (subject, subject_type)
│   └── translations/        # UI strings
│       ├── en.yml
│       └── hi.yml
├── _includes/
│   ├── puranic-context-box.html  # Puranic context component
│   ├── collections-grid.html     # Shared: collection card grid (home + library)
│   └── coming-soon.html          # Shared: coming-soon section (home + library)
├── _layouts/
│   ├── default.html         # Base layout
│   └── verse.html           # Verse rendering template
├── _verses/                 # Jekyll collection
│   ├── hanuman-chalisa/     # 43 verse files (doha-01, chaupai-01..40, doha-closing)
│   ├── sundar-kaand/        # 35 verse files
│   ├── bajrang-baan/
│   ├── sankat-mochan-hanumanashtak/
│   └── ...
├── data/
│   ├── verses/              # Canonical Devanagari verse text (YAML)
│   │   ├── hanuman-chalisa.yml
│   │   └── sundar-kaand.yml
│   ├── scenes/              # Scene descriptions for image generation (YAML)
│   ├── themes/              # Image generation settings (YAML)
│   ├── sources/             # Raw Puranic source texts (TXT)
│   │   ├── shiv-puran-part1.txt
│   │   └── ananda-ramayan.txt
│   ├── puranic-index/       # Indexed Puranic episodes (YAML)
│   │   └── shiv-puran-part1.yml
│   └── embeddings/          # Embedding vectors (JSON)
│       ├── providers/
│       │   ├── openai/collections/
│       │   ├── bedrock-cohere-embed-multilingual-v3/collections/
│       │   └── huggingface-paraphrase-multilingual-mpnet-base-v2/collections/
│       └── puranic/
│           └── shiv-puran-part1.json
├── images/                  # Verse images
│   ├── hanuman-chalisa/modern-minimalist/   # 43 PNG files
│   └── sundar-kaand/modern-minimalist/
├── audio/                   # Audio recitations (full + slow per verse)
│   ├── hanuman-chalisa/
│   ├── sundar-kaand/
│   └── bajrang-baan/
├── library/
│   └── index.html               # Library page (all collections + coming soon)
├── assets/
│   ├── css/
│   │   ├── hanuman.css          # Main stylesheet (see note above re: naming)
│   │   └── print.css
│   └── js/
│       ├── flashcard.js         # Shared flashcard controller (all full-text pages)
│       ├── guidance.js
│       └── ...
├── docs/                    # Documentation
└── scripts/
```

**Naming convention**: Always hyphens, never underscores — `chaupai-01.md`, `chaupai-01.png`, `chaupai-01-full.mp3`

## Content Architecture

### Verse File Structure

Each verse file (`_verses/{collection}/{verse-id}.md`) contains YAML front matter:

```yaml
---
layout: verse
collection_key: hanuman-chalisa
permalink: /chalisa/chaupai-01/
verse_number: 3
devanagari: |
  जय हनुमान ज्ञान गुन सागर।
transliteration: |
  Jai Hanuman Gyaan gun saagar
word_meanings:
- word: जय
  roman: Jai
  meaning:
    en: Victory/Hail
    hi: विजय
literal_translation:
  en: "Hail Hanuman, ocean of knowledge..."
  hi: "हनुमान की जय हो..."
puranic_context:
- id: hanuman-shiva-avatar
  type: concept
  title:
    en: Hanuman as an Avatar of Shiva
  source_texts:
  - text: Shiv Puran Part1
    section: Rudrasamhita, Kumarakhanda
---
```

### Template Rendering

`_layouts/verse.html` renders all content from YAML — change the template once, affects all verses.

## SDK Workflow

All content generation uses **sanatan-verse-sdk** (v0.31.2) via Python venv:

```bash
# Always use venv
./venv/bin/verse-generate --collection hanuman-chalisa --verse chaupai-01 --auto-generate-scene
./venv/bin/verse-generate --collection sundar-kaand --next --auto-generate-scene

# Puranic context (two-stage)
./venv/bin/verse-index-sources --file data/sources/shiv-puran-part1.txt --project-dir .
./venv/bin/verse-puranic-context --collection hanuman-chalisa --all
```

See [puranic-context.md](puranic-context.md) for the full two-stage workflow.

## Internationalization (i18n)

- English (default) + Hindi (हिन्दी)
- UI strings in `_data/translations/{en,hi}.yml`
- Content translated inline: `literal_translation.en` / `literal_translation.hi`
- Language switching via `?lang=hi` URL param, persisted in localStorage
- Fallback: missing Hindi → show English

## Key Features

### Pluggable Embeddings Providers
- Provider-scoped storage: `data/embeddings/providers/{provider}/collections/`
- Runtime selection from `_data/embeddings.yml` via `active_provider`
- Build-time generation via `verse-embeddings` with provider/model switches
- Current providers:
  - OpenAI (`text-embedding-3-small`)
  - Bedrock Cohere (`cohere.embed-multilingual-v3`)
  - Hugging Face (`sentence-transformers/paraphrase-multilingual-mpnet-base-v2`)

### Spiritual Guidance (RAG System) (`/guidance`)
- GPT-4o + verse-embeddings + Cloudflare Worker proxy
- Semantic retrieval with provider-aware query embeddings where available
- Runtime provider switching via `_data/embeddings.yml` (OpenAI ↔ Bedrock Cohere ↔ Hugging Face)
- Bilingual support
- Puranic source embeddings fetched from Cloudflare R2 (URLs in `window.EMBEDDINGS_CONFIG.puranicSources`)

**Files**: `_data/embeddings.yml`, `data/embeddings/providers/*/collections/index.json`, `assets/js/guidance.js`, `workers/cloudflare-worker.js`

### Cloudflare R2 (`hanuman-gpt-embeddings` bucket)
Large Puranic embedding files (> 25 MB) cannot be served from Cloudflare Pages. They are stored in R2 with public access:

| File | R2 path |
|------|---------|
| `shiv-puran-part1.json` (45 MB) | `puranic/shiv-puran-part1.json` |
| `ananda-ramayan.json` (22 MB) | `puranic/ananda-ramayan.json` |

Public base URL: `https://pub-7a286ab192d84d218d1bcca8bbd68361.r2.dev`

After regenerating puranic embeddings locally, upload to R2:
```bash
npx wrangler r2 object put hanuman-gpt-embeddings/puranic/<filename>.json \
  --file data/embeddings/puranic/<filename>.json \
  --content-type application/json \
  --remote
```

### Flashcard View
All four full-text pages (`/chalisa/full-chalisa/`, `/sundar-kaand/full-text/`, `/bajrang-baan/full-text/`, `/sankat-mochan-hanumanashtak/full-text/`) share a single flashcard controller in `assets/js/flashcard.js`. Features:
- Swipe navigation (mobile) and arrow keys (desktop)
- Progress bar and verse counter
- Audio pronunciation button (fetches `audio/{collection}/{verse-id}-full.mp3`)
- Session storage saves last-viewed card per page
- Auto-activates on mobile viewport

### Mobile Bottom Navigation
Five-item fixed bottom nav (mobile only): Home · Chalisa · Sundar Kaand · 📚 Library · Ask. The Library tab is active when browsing `/library/`, `/bajrang-baan/`, or `/sankat-mochan-hanumanashtak/`.

### Puranic Context
- Per-verse grounded references from indexed sacred texts
- Two-stage: index source → generate context per verse
- Sources: Shiv Puran Part1 (1009 episodes), Ananda Ramayana (indexing)
- Displayed inline on each verse page, always expanded

### Image Theme System
- Multiple artistic styles per verse
- Instant theme switching via JavaScript
- Themes configured in `data/themes/{collection}/*.yml`

### Navigation
- Arrow keys (← →) between verses
- Previous/Next buttons, language preserved in navigation

## Media Generation

### Images
**Technology**: gpt-image-1 via sanatan-verse-sdk

```bash
verse-images --collection hanuman-chalisa --theme-name modern-minimalist
verse-images --collection hanuman-chalisa --theme-name modern-minimalist --regenerate chaupai-10.png
```

**Output**: 1024×1536 PNG in `images/{collection}/{theme}/`
**Cost**: ~$0.04 per image

### Audio
**Technology**: Eleven Labs TTS via sanatan-verse-sdk

```bash
verse-audio --collection hanuman-chalisa
verse-audio --collection hanuman-chalisa --only chaupai-01-full.mp3
```

**Output**: 2 MP3 per verse (`chaupai-01-full.mp3`, `chaupai-01-slow.mp3`) in `audio/{collection}/`
**Cost**: Free tier (10,000 chars/month)

### Embeddings
**Technology**: Configurable via sanatan-verse-sdk
- OpenAI (`text-embedding-3-small`)
- Bedrock Cohere (`cohere.embed-multilingual-v3`)
- Hugging Face (`sentence-transformers/paraphrase-multilingual-mpnet-base-v2`)

```bash
verse-embeddings --provider openai --multi-collection --collections-file _data/collections.yml \
  --output-dir data/embeddings/providers/openai/collections

verse-embeddings --provider bedrock-cohere --multi-collection --collections-file _data/collections.yml \
  --output-dir data/embeddings/providers/bedrock-cohere-embed-multilingual-v3/collections

verse-embeddings --multi-collection \
  --provider huggingface \
  --model sentence-transformers/paraphrase-multilingual-mpnet-base-v2 \
  --collections-file _data/collections.yml \
  --output-dir data/embeddings/providers/huggingface-paraphrase-multilingual-mpnet-base-v2/collections
```

**Output**:
- Verse embeddings: `data/embeddings/providers/{provider}/collections/{collection}.json`
- Verse index: `data/embeddings/providers/{provider}/collections/index.json`
- Puranic source embeddings: generated locally to `data/embeddings/puranic/{source-key}.json`, then uploaded to Cloudflare R2 (see below) — excluded from the Jekyll build due to file size

## Development Workflow

1. **Edit** - OpenAI Codex / Claude Code or PyCharm edits files
2. **Review** - PyCharm diff view
3. **Commit** - Git with co-author tag
4. **Push** - GitHub receives changes
5. **Build** - GitHub Pages auto-builds Jekyll (1-2 min)
6. **Deploy** - Live at https://hanumanji.ai

## Cost Per Verse
~$0.05-0.06 (AI content + image + audio + embeddings)

- **Hosting**: Free (GitHub Pages + custom domain ~$10-15/year)
- **Images**: ~$0.06 per image (gpt-image-1, medium quality)
- **Audio**: Free (Eleven Labs free tier)
- **Embeddings**:
  - OpenAI: ~$0.001 per verse (text-embedding-3-small)
  - Bedrock Cohere: provider- and token-dependent
- **Puranic Context**: ~$0.02 per verse (GPT-4o RAG)

## Browser Compatibility

- Chrome/Edge, Firefox, Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)
- No polyfills needed

## Performance

- Static HTML (no server processing)
- CDN via GitHub Pages
- Load time: < 1 second (text), 2-3 seconds (with images)

## Security

- Static site (no database, no server-side code)
- HTTPS enforced by GitHub Pages
- No user input or tracking

## Resources

- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Liquid Template Guide](https://shopify.github.io/liquid/)

## Internal Documentation

- [puranic-context.md](puranic-context.md) - Puranic context two-stage workflow
- [background.md](background.md) - Hanuman Chalisa history
- [cloudflare-worker-setup.md](../guides/cloudflare-worker-setup.md) - Deployment setup
