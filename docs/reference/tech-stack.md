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
│  • images/ (43 PNG per theme) - verse-images│
│  • audio/ (86 MP3 files) - verse-audio      │
│  • embeddings/ - verse-embeddings           │
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
- **Python 3.8+** - For sanatan-sdk
- **ffmpeg** - Audio post-processing (`brew install ffmpeg`)
- **Ruby 3.3+** - For Jekyll local development
- **Node.js** (optional) - For Cloudflare Worker deployment

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
│   └── js/guidance.js      # RAG system
├── scripts/                 # Content generation configuration
│   ├── embedding_config.yaml       # Config for verse-embeddings
│   ├── requirements.txt            # sanatan-sdk installation
│   └── legacy/                     # Old Python/bash scripts (deprecated)
├── images/                  # Verse images (organized by theme)
│   └── modern-minimalist/  # 47 PNG files per theme
├── audio/                   # Audio recitations (86 MP3 files)
├── docs/                    # Documentation
├── data/embeddings.json     # Pre-computed embeddings (1.1MB)
├── guidance.html            # Spiritual guidance chat interface
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

See [Adding New Languages](../features/multilingual.md#adding-new-languages) in the multilingual implementation guide for step-by-step instructions.

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

**Technology**: GPT-4o + verse-embeddings + Cloudflare Worker

**Features**:
- AI-powered Q&A on Hanuman Chalisa verses
- Keyword-based retrieval with verse citations
- Bilingual support (English/Hindi)
- Serverless proxy (no user API keys needed)

**Commands**:
```bash
# Generate embeddings
verse-embeddings --provider huggingface  # Free, local
verse-embeddings --provider openai       # Fast, ~$0.01

# Deploy worker
verse-deploy
```

**Files**:
- `data/embeddings.json` - Pre-computed vectors (1.1MB, 384-dim)
- `guidance.html` - Chat interface
- `assets/js/guidance.js` - RAG logic
- `workers/cloudflare-worker.js` - API proxy

**Deployment**: `https://hanuman-chalisa-api.arungupta.workers.dev`

See [deployment guide](deployment.md) for details.

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
6. **Deploy** - Live at https://sanatan-learnings.github.io/hanuman-gpt/

## Media Generation

### Images

**Technology**: DALL-E 3 via sanatan-sdk

**Commands**:
```bash
verse-images --theme-name modern-minimalist
verse-images --theme-name watercolor --style "soft watercolor painting"
verse-images --theme-name my-theme --quality hd
verse-images --theme-name my-theme --regenerate verse-10.png,verse-25.png
verse-images --theme-name my-theme --force
```

**Output**: 47 PNG files per theme in `images/{theme}/`
- Format: 1024×1536 PNG (2:3 ratio)
- Cost: $1.88 standard / $3.76 HD per theme

**Theme Configuration**: Define in `_data/themes.yml`

See [scripts/README.md](../scripts/README.md) for details.

### Audio Recitations

**Technology**: Eleven Labs TTS via sanatan-sdk

**Commands**:
```bash
verse-audio
verse-audio --only doha_01_full.mp3
verse-audio --regenerate verse_10_full.mp3,verse_10_slow.mp3
verse-audio --start-from verse_15_full.mp3
verse-audio --force
```

**Output**: 86 MP3 files (43 verses × 2 speeds) in `audio/`
- Full speed: Natural pace
- Slow speed: 75% speed via ffmpeg
- Cost: Free tier (10,000 chars/month)

See [scripts/README.md](../scripts/README.md) for details.

### Embeddings

**Technology**: OpenAI / HuggingFace via sanatan-sdk

**Commands**:
```bash
verse-embeddings                        # OpenAI (fast, ~$0.01)
verse-embeddings --provider huggingface # Local (free, slower first run)
verse-embeddings --verses-dir _verses --output data/embeddings.json
```

**Output**: `data/embeddings.json` (1.1MB, 384 dimensions)

**Process**: Extracts YAML from 43 verse files, generates semantic vectors

See [scripts/README.md](../scripts/README.md) for details.

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
- **Images**: $1.72 per theme (43 images × $0.040) via verse-images
- **Audio**: FREE (Eleven Labs free tier) via verse-audio
- **Embeddings**: FREE (local HuggingFace) or $0.01 (OpenAI) via verse-embeddings
- **Spiritual Guidance**: ~$0.01 per query (Cloudflare Worker proxy)

**Total**: ~$1.88 per image theme (one-time)

## Resources

- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Liquid Template Guide](https://shopify.github.io/liquid/)

## Internal Documentation

- [background.md](background.md) - Hanuman Chalisa history
- [cloudflare-worker-setup.md](../guides/cloudflare-worker-setup.md) - Deployment setup
