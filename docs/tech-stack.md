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
├── assets/
│   ├── css/style.css       # Custom styling
│   └── js/navigation.js    # Arrow key navigation
├── images/                  # Verse images (coming soon)
├── audio/                   # Audio recitations (coming soon)
├── docs/                    # Documentation
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
- `{{ page.devanagari }}` - Devanagari text
- `{{ page.transliteration }}` - Phonetic transliteration
- `{% for item in page.word_meanings %}` - Word meanings loop
- All formatting and structure defined once in template

**Benefits:**
- Change template once, affects all 43 verses
- Clean separation of data and presentation
- Easy to maintain and update

## Development Workflow

1. **Edit** - PyCharm or Claude Code edits YAML in `_verses/*.md`
2. **Review** - PyCharm's diff view for visual code review
3. **Commit** - Git with descriptive messages
4. **Push** - GitHub receives changes
5. **Build** - GitHub Pages automatically builds Jekyll site (1-2 min)
6. **Deploy** - Live at https://arun-gupta.github.io/hanuman-chalisa/

## Media Generation (Planned)

### Images
- **Midjourney** - AI image generation
- Export as JPG (800×600px)
- Store in `/images/verse_01.jpg`, etc.

### Audio Recitations
- **ElevenLabs** - AI voice synthesis
- Full-speed and slow-speed versions
- Export as MP3 (128kbps)
- Store in `/audio/verse_01_full.mp3`, `/audio/verse_01_slow.mp3`

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

**Collaboration Pattern:**
1. Claude Code generates structure and content
2. PyCharm shows visual diff of changes
3. Human reviews in PyCharm UI
4. Changes committed and pushed
5. GitHub Pages builds automatically

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
- **Images** (one-time): Midjourney $10-60/month
- **Audio** (one-time): ElevenLabs $5-330/month

**Total**: Free for hosting, ~$50-200 one-time for media

## Resources

- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Liquid Template Guide](https://shopify.github.io/liquid/)

## Internal Documentation

- [verse-structure.md](verse-structure.md) - Verse YAML structure
- [background.md](background.md) - Hanuman Chalisa history
- [guide.md](guide.md) - Recitation guide
- [github-pages-setup.md](github-pages-setup.md) - Deployment setup

---

**Last Updated:** January 2026
