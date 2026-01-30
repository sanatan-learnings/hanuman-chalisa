# Technology Stack

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│         DEVELOPMENT ENVIRONMENT              │
├─────────────────────────────────────────────┤
│  Claude Code (AI)  │  PyCharm (Human Review) │
└──────────┬──────────┴──────────┬────────────┘
           │                     │
           ▼                     ▼
┌──────────────────────────────────────────────┐
│            CONTENT (YAML + Markdown)          │
├──────────────────────────────────────────────┤
│  • _verses/*.md (43 files with YAML)         │
│  • _layouts/*.html (Liquid templates)        │
│  • Devanagari, transliteration, meanings    │
└──────────────────┬───────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────┐
│           AI-GENERATED MEDIA ASSETS           │
├──────────────────────────────────────────────┤
│  • images/ (47 PNG per theme - DALL-E 3)    │
│  • audio/ (86 MP3 files - Eleven Labs)      │
│    - 43 verses × 2 speeds (full + slow)     │
└──────────────────┬───────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────┐
│       VERSION CONTROL & DEPLOYMENT           │
├──────────────────────────────────────────────┤
│  Git → GitHub → Jekyll Build → Live Site    │
└──────────────────────────────────────────────┘
```

## Core Technologies

### Static Site Generation
- **Jekyll** (v4.x) - Ruby-based static site generator
- **GitHub Pages** - Free hosting with automatic Jekyll builds
- **Liquid Templates** - Template engine for dynamic HTML generation

### Frontend
- **HTML5** - Semantic markup
- **Custom CSS** - Responsive design with orange/saffron theme
- **Vanilla JavaScript** - Arrow key navigation, no frameworks needed

### Content Structure
- **YAML Front Matter** - All verse content structured as data
- **Markdown Files** - Each verse is a `.md` file with YAML front matter
- **Jekyll Collections** - `_verses/` directory with 43 verse files
- **Multi-Language Support** - English + Hindi with extensible architecture

## Development Tools

### PyCharm IDE
- Code editing and project management
- Visual git diff and merge tools
- Markdown preview with Devanagari support
- Structure view for navigation
- Embedded terminal for Claude Code

### Claude Code
- AI-assisted content generation
- Project scaffolding (Jekyll setup, templates)
- Bulk file operations (43 verse conversions)
- Git workflow automation
- Documentation generation

### System Dependencies
- **Python 3.8+** - For image and audio generation scripts
- **ffmpeg** - Audio post-processing for slow speed versions
  - macOS: `brew install ffmpeg`
  - Linux: `sudo apt-get install ffmpeg`
- **Ruby 3.3+** - For Jekyll local development
- **Node.js** (optional) - For Cloudflare Worker development

**Collaboration Pattern:**
1. Claude Code generates structure and content
2. PyCharm shows visual diff of changes
3. Human reviews in PyCharm UI
4. Changes committed and pushed
5. GitHub Pages builds automatically

## Project Structure

```
hanuman-chalisa/
├── _config.yml              # Jekyll configuration
├── _layouts/
│   ├── default.html         # Base layout (header, footer)
│   └── verse.html           # Verse rendering template
├── _verses/                 # Jekyll collection (43 files)
│   ├── doha_01.md          # YAML front matter only
│   ├── doha_02.md
│   ├── verse_01.md through verse_40.md
│   └── doha_closing.md
├── _data/
│   └── translations/        # UI translations
│       ├── en.yml          # English (includes guidance strings)
│       └── hi.yml          # Hindi
├── assets/
│   ├── css/style.css       # Custom styling
│   ├── js/navigation.js    # Arrow key navigation
│   ├── js/language.js      # Language switching
│   ├── js/theme.js         # Image theme switching
│   └── js/guidance.js      # RAG system (NEW)
├── scripts/                 # Python and bash utilities
│   ├── generate_embeddings_local.py  # Local embedding generation
│   ├── embedding_config.yaml         # Config for embeddings
│   ├── generate_audio.py             # Eleven Labs audio generation
│   ├── generate_audio.sh             # Audio generation wrapper
│   ├── generate_theme_images.py      # DALL-E 3 image generation
│   ├── generate_images.sh            # Image generation wrapper
│   └── requirements.txt              # Python dependencies (elevenlabs, openai, etc.)
├── images/                  # Verse images (organized by theme)
│   └── modern-minimalist/  # Current theme (47 images complete)
│       ├── title-page.png
│       ├── opening-doha-01.png
│       ├── opening-doha-02.png
│       ├── verse-01.png through verse-40.png
│       └── closing-doha.png
├── audio/                   # Audio recitations (86 MP3 files: 43 verses × 2 speeds)
├── docs/                    # Documentation
├── venv/                    # Python virtual environment (NEW, excluded from Jekyll)
├── data/embeddings.json          # Pre-computed embeddings - 1.1MB (NEW)
├── guidance.html            # Spiritual guidance chat interface (NEW)
└── index.html              # Home page with navigation
```

## Content Architecture

### YAML Front Matter Structure

Each verse file (`_verses/*.md`) contains only YAML front matter:

```yaml
---
layout: verse
title: "Verse 1: Ocean of Knowledge and Virtues"
verse_number: 1
previous_verse: "/verses/doha_02"
next_verse: "/verses/verse_02"

devanagari: |
  जय हनुमान ज्ञान गुन सागर।
  जय कपीस तिहुं लोक उजागर।।

transliteration: |
  Jai Hanuman Gyaan gun saagar
  Jai Kapis Tihun lok ujagar

phonetic_notes:
  - word: "हनुमान"
    phonetic: "ha-nu-maan"
    emphasis: "last syllable"

word_meanings:
  - word: "जय"
    roman: "Jai"
    meaning: "victory/hail"

literal_translation: "Hail Hanuman, ocean of knowledge..."
interpretive_meaning: "Hanuman is described as an ocean..."
story: "Hanuman was blessed by various gods..."

practical_application:
  teaching: "True greatness combines knowledge..."
  when_to_use: "Recite when seeking wisdom..."
---
```

### Template Rendering

The `_layouts/verse.html` template renders all content from YAML data:
- `{% raw %}{{ page.devanagari }}{% endraw %}` - Devanagari text
- `{% raw %}{{ page.transliteration }}{% endraw %}` - Phonetic transliteration
- `{% raw %}{% for item in page.word_meanings %}{% endraw %}` - Word meanings loop
- All formatting and structure defined once in template

**Benefits:**
- Change template once, affects all 43 verses
- Clean separation of data and presentation
- Easy to maintain and update

## Internationalization (i18n)

### Multi-Language Architecture

The site supports multiple languages with extensible architecture:

**Current Languages:**
- English (default)
- Hindi (हिन्दी)

**Translation System:**
```
_data/
  translations/
    en.yml    # English UI strings
    hi.yml    # Hindi UI strings
```

**UI Translations:** ~70 strings per language
- Navigation labels (Previous, Next, Home)
- Section headings (Devanagari, Transliteration, etc.)
- Common labels (Coming Soon, Audio Recitation)
- Home page content, footer text

**Content Translations:** Multi-language verse content
```yaml
literal_translation:
  en: "Hail Hanuman, ocean of knowledge..."
  hi: "हनुमान की जय हो, ज्ञान और गुणों के सागर..."

interpretive_meaning:
  en: "Hanuman is described as an ocean..."
  hi: "हनुमान को एक सागर के रूप में वर्णित किया गया है..."
```

**Language Switching:**
- Dropdown selector in header
- URL parameter support (`?lang=hi`)
- localStorage for preference persistence
- Preserved across navigation

**Fallback System:**
- If Hindi translation missing → show English
- Graceful degradation
- No broken content

### Adding New Languages

See [Adding New Languages](multilingual-implementation.md#adding-new-languages) in the multilingual implementation guide for step-by-step instructions.

## Key Features

### 1. Single-Page View (`/full-chalisa`)
- All 43 verses on one page
- Toggle sections (transliteration, translation, word meanings)
- Print-friendly button
- Automatic generation from `site.verses` collection
- Jekyll template loops through all verses dynamically

### 2. Search Functionality (`/search`)
- Client-side search across all content
- Search in: Devanagari, transliteration, translations, meanings
- Real-time filtering with debouncing
- Highlight matching text
- Result snippets with context
- Generated JSON index (`data/search.json`)

### 3. Spiritual Guidance (RAG System) (`/guidance`)
- **AI-powered Q&A** - Ask spiritual questions and receive guidance
- **Retrieval Augmented Generation (RAG)** - Finds relevant verses for context
- **Keyword-based search** - Matches queries to verse content
- **GPT-4 integration** - Generates spiritual guidance based on verses
- **Bilingual support** - Works in English and Hindi
- **Conversation history** - Maintains context for follow-up questions
- **Two deployment modes** - User-provided API key OR Cloudflare Worker (serverless)
- **Verse citations** - Links to relevant verses in responses

**Technical Implementation:**
- Pre-generated embeddings using sentence-transformers (384 dimensions, generated locally)
- Keyword-based retrieval for client-side simplicity
- OpenAI GPT-4o for spiritual guidance generation
- Cost: ~$0.01 per query (site owner pays)

**Production Architecture:**
- **Cloudflare Worker** - Serverless proxy for OpenAI API
- Site owner's API key stored securely as Cloudflare secret
- Users make requests to worker endpoint
- Worker forwards to OpenAI API
- **Frictionless UX** - No API key entry needed by users
- Rate limiting built-in (10 req/min per IP)
- Free tier: 100,000 requests/day
- CORS-enabled for browser requests
- Current deployment: `https://hanuman-chalisa-api.arungupta.workers.dev`

**Files:**
- `scripts/generate_embeddings_local.py` - Local HuggingFace embedding generation (FREE)
- `data/embeddings.json` - Pre-computed verse embeddings (1.1MB, 384-dim)
- `guidance.html` - Chat interface
- `assets/js/guidance.js` - RAG pipeline logic
- `workers/cloudflare-worker.js` - Serverless API proxy for OpenAI
- `wrangler.toml` - Cloudflare Worker configuration
- `scripts/deploy-cloudflare-worker.sh` - Automated deployment script
- `venv/` - Python virtual environment (excluded from Jekyll build)

**Deployment:**
- Automated script: `./scripts/deploy-cloudflare-worker.sh`
- Manual CLI: `wrangler deploy` + `wrangler secret put OPENAI_API_KEY`
- Dashboard: Copy/paste worker code via Cloudflare UI
- See: [docs/cloudflare-worker-setup.md](cloudflare-worker-setup.md)

**Developer Note:**
The code supports an alternative "user-provided API key" mode for development by setting `WORKER_URL = ''` in `assets/js/guidance.js`, but this is not exposed to end users in production.

### 4. Navigation
- Arrow keys (← →) between verses
- Previous/Next buttons on each verse
- Home button (☰ All Verses)
- Language preserved in navigation
- Keyboard shortcuts help

### 5. Print Support
- Dedicated print.css for printer-friendly output
- Hide navigation and non-essential elements
- Optimized typography for paper
- A4 page configuration
- Print button on full chalisa view

### 6. Image Theme System
- Theme selector in header (🎨 icon)
- Multiple artistic styles for verse images
- Instant switching via JavaScript (no page reload)
- localStorage persistence across pages
- Extensible architecture via `_data/themes.yml`
- Current themes: Modern Minimalist (more coming soon)
- All 47 images organized by theme in `/images/{theme}/`

## Development Workflow

1. **Edit** - PyCharm or Claude Code edits YAML in `_verses/*.md`
2. **Review** - PyCharm's diff view for visual code review
3. **Commit** - Git with descriptive messages
4. **Push** - GitHub receives changes
5. **Build** - GitHub Pages automatically builds Jekyll site (1-2 min)
6. **Deploy** - Live at https://sanatan-learnings.github.io/hanuman-chalisa/

## Media Generation

### Images

**Technology:**
- **DALL-E 3** - AI image generation via OpenAI API
- **Python script** - `scripts/generate_theme_images.py`
- **Bash wrapper** - `scripts/generate_images.sh`

**Output:**
- **Format**: PNG (high resolution, 1024×1024)
- **Total files**: 47 images per theme (title + 2 opening dohas + 40 verses + closing doha)
- **Naming**: `title-page.png`, `opening-doha-01.png`, `verse-01.png`, `closing-doha.png`
- **Directory**: `/images/{theme-name}/`

**Status:** ✅ Complete - Two themes generated (Modern Minimalist, Kids Friendly)

**Generation Commands:**
```bash
# Generate all images for a theme
./scripts/generate_images.sh modern-minimalist

# Generate single image for testing
./scripts/generate_images.sh modern-minimalist --only verse-01.png

# Regenerate specific images
./scripts/generate_images.sh modern-minimalist --regenerate verse-10.png,verse-30.png

# Force regenerate ALL images
./scripts/generate_images.sh modern-minimalist --force
```

**Pipeline:**
1. Read scene descriptions from `docs/image-prompts.md`
2. Generate images via DALL-E 3 API (1024×1792 portrait)
3. Crop to 1024×1536 (2:3 ratio for verse pages)
4. Save as PNG in `/images/{theme-name}/`

**Requirements:**
- OpenAI API key (stored in `.env`)
- Python packages: `openai`, `pillow`, `requests`

**Cost:** ~$2 per theme (47 images × $0.040 standard quality)

#### Theme Configuration
Themes are defined in `_data/themes.yml`:
```yaml
modern-minimalist:
  name_en: "Modern Minimalist"
  name_hi: "आधुनिक न्यूनतम"
  description_en: "Contemporary spiritual aesthetics"
  folder: "modern-minimalist"
  default: true
```

#### Theme Switching
- Dropdown selector in header (next to language selector)
- JavaScript-based instant theme switching (no page reload)
- localStorage for preference persistence
- All images automatically updated when theme changes
- Extensible to support future themes (Traditional, Watercolor, etc.)

### Audio Recitations

**Technology:**
- **Eleven Labs** - AI text-to-speech (eleven_multilingual_v2 model for Hindi/Sanskrit)
- **ffmpeg** - Audio post-processing for speed control
- **Python script** - `scripts/generate_audio.py`
- **Bash wrapper** - `scripts/generate_audio.sh`

**Output:**
- **Format**: MP3 (128kbps+, Eleven Labs default)
- **Total files**: 86 audio files (43 verses × 2 speeds)
- **Two versions per verse**:
  - Full speed: Natural conversational pace
  - Slow speed: 75% speed (slowed via ffmpeg `atempo` filter)
- **Naming**: `doha_01_full.mp3`, `doha_01_slow.mp3`, `verse_01_full.mp3`, `verse_01_slow.mp3`
- **Directory**: `/audio/`
- **Voice**: Rachel (default) - clear, neutral female voice

**Status:** ✅ Complete - All 86 files generated

**Generation Commands:**
```bash
# Generate all audio files
./scripts/generate_audio.sh

# Generate single file for testing
./scripts/generate_audio.sh --only doha_01_full.mp3

# Regenerate specific files
./scripts/generate_audio.sh --regenerate verse_10_full.mp3,verse_10_slow.mp3

# Force regenerate ALL files
./scripts/generate_audio.sh --force
```

**Pipeline:**
1. Extract Devanagari text from verse YAML front matter
2. Generate audio via Eleven Labs API (text-to-speech)
3. For slow version: Apply ffmpeg `atempo=0.75` filter (25% slower without pitch change)
4. Save as MP3 in `/audio/` directory

**Requirements:**
- Eleven Labs API key (stored in `.env`)
- `ffmpeg` for slow speed processing (`brew install ffmpeg` on macOS)
- Python packages: `elevenlabs`, `python-dotenv`

**Cost:** ~$0.02 total (fits within free tier: 10,000 characters/month)

### Embeddings Generation (Python)
- **sentence-transformers** - Local embedding generation
- **Model**: sentence-transformers/all-MiniLM-L6-v2 (384 dimensions)
- **Virtual environment** - `venv/` for isolated dependencies
- **Cost**: FREE (runs locally, no API calls)
- **Output**: `data/embeddings.json` (1.1MB for 43 verses × 2 languages)

**Dependencies** (in `venv/`):
```bash
pip install sentence-transformers  # ~500MB including PyTorch
```

**Generation command:**
```bash
./venv/bin/python scripts/generate_embeddings_local.py
```

**Process:**
1. Reads all 43 verse files from `_verses/`
2. Extracts YAML front matter (title, transliteration, meanings, stories)
3. Combines fields into rich semantic documents
4. Generates 384-dimensional embeddings locally
5. Outputs `data/embeddings.json` with verse metadata + vectors
6. Takes ~2-3 minutes on modern hardware

## URLs and Navigation

Each verse has its own URL:
- `/verses/doha_01/`
- `/verses/verse_01/`
- `/verses/verse_02/`
- etc.

Navigation:
- Arrow keys (← →) between verses
- Home (☰) button to main page
- Previous/Next buttons on each verse

## Browser Compatibility

- Chrome/Edge, Firefox, Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)
- CSS Grid, Flexbox, HTML5 Audio
- No polyfills needed

## Performance

- Static HTML (no server processing)
- System fonts (no downloads)
- CDN via GitHub Pages
- Load time: < 1 second (text)
- Full load: 2-3 seconds (with images)

## Security

- Static site (no database, no server-side code)
- HTTPS enforced by GitHub Pages
- No user input or tracking
- Minimal attack surface

## Cost

- **Hosting**: Free (GitHub Pages)
- **Domain** (optional): $10-15/year
- **Images**: DALL-E 3 via OpenAI API
  - Standard quality: $0.040/image
  - 44 images per theme: ~$1.76 per theme
  - Current: 2 themes × 44 images = $3.52 total (one-time)
- **Audio**: Eleven Labs text-to-speech
  - Free tier: 10,000 characters/month
  - Total needed: ~10,000-15,000 characters (86 files)
  - Cost: FREE (fits within free tier, one-time generation)
- **Embeddings**: FREE (generated locally with HuggingFace)
- **Spiritual Guidance**: ~$0.01 per query (user-borne if using worker mode)

**Total**: Free for hosting, ~$3.52 one-time cost for AI-generated media

## Resources

- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Liquid Template Guide](https://shopify.github.io/liquid/)

## Internal Documentation

- [verse-structure.md](verse-structure.md) - Verse YAML structure
- [background.md](background.md) - Hanuman Chalisa history
- [user-guide.md](user-guide.md) - Recitation guide
- [github-pages-setup.md](github-pages-setup.md) - Deployment setup
