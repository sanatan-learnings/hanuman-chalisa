# GitHub Pages Setup

This document explains how the Hanuman Chalisa website is structured and how GitHub Pages generates the live site from this repository.

## Live Website

**🌐 View the live site:** [https://sanatan-learnings.github.io/hanuman-chalisa/](https://sanatan-learnings.github.io/hanuman-chalisa/)

## How It Works

This repository uses **Jekyll** (a static site generator) with **GitHub Pages** to automatically convert YAML data and templates into a beautiful, navigable website.

### The Magic of Jekyll + GitHub Pages

1. **You write data in YAML** - Verse content structured in `_verses/*.md` as YAML front matter
2. **Templates render the data** - Jekyll processes `_layouts/verse.html` template
3. **Push to GitHub** - When you commit and push changes
4. **GitHub builds automatically** - Jekyll runs on GitHub's servers
5. **Site is live** - Changes appear at the URL above within 1-2 minutes

No manual HTML generation needed! GitHub does it all automatically.

## YAML Front Matter Architecture

Each verse file in `_verses/` contains **YAML front matter only** (no markdown body):

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
  - word: "हनुमान"
    roman: "Hanuman"
    meaning: "Lord Hanuman"

literal_translation: "Hail Hanuman, ocean of knowledge..."
interpretive_meaning: "Hanuman is described as an ocean..."
story: "Hanuman was blessed by various gods..."

practical_application:
  teaching: "True greatness combines knowledge..."
  when_to_use: "Recite when seeking wisdom..."
---
```

This tells Jekyll:
- **`layout`** - Which template to use (`_layouts/verse.html`)
- **`title`** - Page title and heading
- **`verse_number`** - Used to generate image filename
- **Navigation** - Previous/next verse URLs for arrow keys
- **Content** - All verse data structured in YAML

The template (`_layouts/verse.html`) processes this data and generates HTML automatically.

## Key Features

### 1. Arrow Key Navigation
- **Left Arrow (←)** - Previous verse
- **Right Arrow (→)** - Next verse
- **H or Home** - Return to verse list
- Works seamlessly across all 43 verses

### 2. Responsive Design
- Mobile-friendly layout
- Adapts to all screen sizes
- Touch-friendly navigation buttons

### 3. Audio Integration (Coming Soon)
- Full speed recitation for each verse
- Slow speed for learning pronunciation
- Direct playback in browser

### 4. Visual Content (Coming Soon)
- One image per verse
- Supports iconographic depictions
- Responsive image sizing

## How to Update Content

### Editing Verse Content

1. Edit YAML in `_verses/*.md` file
2. Update fields like `devanagari`, `transliteration`, `word_meanings`, etc.
3. Commit and push to GitHub
4. Site updates automatically in 1-2 minutes

**Example:** To update verse 1's translation, edit `_verses/verse_01.md`

### Changing Formatting for All Verses

1. Edit `_layouts/verse.html` template
2. Modify HTML structure or Liquid tags
3. Commit and push
4. All 43 verses update automatically

**Benefits:** Change once, affects all verses instantly

### Adding Images

1. Place image in `/images/` with correct filename
   - Example: `verse_01.jpg` for Verse 1
   - Naming: `doha_01.jpg`, `verse_01.jpg`, `verse_02.jpg`, etc.
2. Commit and push
3. Image appears automatically on the verse page

### Adding Audio

1. Place audio files in `/audio/` with correct filenames
   - Example: `verse_01_full.mp3` and `verse_01_slow.mp3`
   - Naming pattern: `{verse}_full.mp3` and `{verse}_slow.mp3`
2. Update `_layouts/verse.html` to add audio player HTML
3. Commit and push
4. Audio players appear on all verses

### Updating Styles

1. Edit `/assets/css/style.css`
2. Commit and push
3. New styles apply site-wide

## Jekyll Collections

The `_verses/` directory is a **Jekyll collection** configured in `_config.yml`:

```yaml
collections:
  verses:
    output: true
    permalink: /verses/:name/
```

This tells Jekyll to:
- Process all files in `_verses/`
- Generate a page for each file
- Use URL pattern `/verses/verse_01/`, `/verses/verse_02/`, etc.

**Note:** Collection directories must start with underscore (`_verses/` not `verses/`)

## Enabling GitHub Pages

If GitHub Pages is not yet enabled:

1. Go to repository Settings
2. Navigate to "Pages" in the left sidebar
3. Under "Source", select:
   - Branch: `main`
   - Folder: `/ (root)`
4. Click "Save"
5. Wait 1-2 minutes for the first build
6. Site will be live at: `https://sanatan-learnings.github.io/hanuman-chalisa/`

## Local Development (Optional)

To preview the site locally before pushing:

### Install Jekyll

```bash
# On macOS
brew install ruby
gem install jekyll bundler

# On Linux
sudo apt-get install ruby-full build-essential
gem install jekyll bundler
```

### Run Local Server

```bash
cd hanuman-chalisa
bundle install
jekyll serve
```

Then visit: `http://localhost:4000/hanuman-chalisa/`

**Note:** Local development is optional. You can edit and push directly to GitHub and let it build for you.

## File Requirements

### Images (43 files needed - In Progress)
- Format: PNG (high resolution)
- Naming: `opening-doha-01.png`, `verse-01.png`, etc.
- To generate: Use DALL-E 3 via OpenAI for AI-generated iconographic images
- Status: 6 images added (opening dohas 1-2, verses 1-4)

### Audio (86 files needed - Planned)
- Format: MP3
- Quality: 128kbps minimum
- Two files per verse: `*_full.mp3` and `*_slow.mp3`
- Example: `verse_01_full.mp3`, `verse_01_slow.mp3`
- To generate: Use AI voice synthesis (provider TBD)

### Verses (43 files - ✓ Complete)
- Format: Markdown (.md) with YAML front matter only
- Location: `_verses/` directory
- Content follows YAML structure (see [verse-structure.md](verse-structure.md))

## Troubleshooting

### Site not updating?
- Wait 2-3 minutes after push
- Check repository "Actions" tab for build status
- Look for any error messages
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

### 404 errors?
- Verify GitHub Pages is enabled
- Check that `_config.yml` has correct `baseurl: "/hanuman-chalisa"`
- Ensure file paths match exactly
- Verify `_verses/` directory has underscore prefix

### Styling issues?
- Clear browser cache (hard refresh)
- Check CSS file is committed
- Verify no syntax errors in CSS
- Inspect browser console for errors

### YAML parsing errors?
- Check YAML indentation (use spaces, not tabs)
- Verify all colons have space after them (`word: value`)
- Ensure multiline fields use `|` or `>` properly
- Validate YAML syntax with online validator

## Technology Stack

- **Jekyll** - Static site generator (Ruby-based)
- **Liquid** - Template language for dynamic content
- **YAML** - Data format for verse content
- **Markdown** - File format (with YAML front matter)
- **GitHub Pages** - Free hosting with automatic builds
- **HTML/CSS/JavaScript** - Frontend technologies

## Benefits of This Approach

✅ **Data-driven** - Content separated from presentation
✅ **Maintainable** - Change template once, affects all verses
✅ **Automatic deployment** - Push and it's live
✅ **Version controlled** - Full git history of changes
✅ **Free hosting** - GitHub Pages is free
✅ **Fast and secure** - Static site = no server vulnerabilities
✅ **Consistent** - All verses follow identical structure

## Additional Resources

- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Liquid Template Guide](https://shopify.github.io/liquid/)
- [verse-structure.md](verse-structure.md) - YAML structure details
- [tech-stack.md](tech-stack.md) - Complete technology overview

## Questions or Issues?

Open an issue at: [GitHub Issues](https://github.com/sanatan-learnings/hanuman-chalisa/issues)
