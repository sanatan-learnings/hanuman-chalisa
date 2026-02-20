# Claude Code Guide - Hanuman GPT

## Project Overview
Jekyll-based website for sacred Hindu texts with multimedia content (images, audio, embeddings). Currently contains Hanuman Chalisa and Sundar Kaand collections.

## Critical Naming Conventions
**ALWAYS use hyphens, never underscores:**
- Verse files: `chaupai-01.md` NOT `chaupai_01.md`
- Audio files: `chaupai-01-full.mp3` NOT `chaupai_01_full.mp3`
- Image files: `chaupai-01.png` NOT `chaupai_01.png`
- Permalinks: `/sundar-kaand/chaupai-01/` NOT `/sundar-kaand/chaupai_01/`

**Important:** Use verse IDs from YAML `_meta.sequence` directly in commands (e.g., `chaupai-15`) to ensure correct hyphenated filenames.

## Project Structure
```
_verses/{collection}/            # Verse markdown files (generated)
audio/{collection}/              # Audio pronunciations (generated: full + slow)
images/{collection}/{theme}/     # Generated images
data/
  ├── verses/{collection}.yml    # Source: Canonical verse text (Devanagari)
  ├── scenes/{collection}.yml    # Source: Scene descriptions for image generation
  └── themes/{collection}/*.yml  # Config: Image generation settings
```

## Verse Types & Numbering
- **Hanuman Chalisa**: doha-01, doha-02, chaupai-01 to chaupai-40, doha-closing
- **Sundar Kaand**: shloka_01-03, chaupai_01-522, doha_01-58 (underscore in YAML, hyphen in files)
- `verse_number`: Global sequence number (e.g., 15 for chaupai_11 in Sundar Kaand)
- `verse_type`: shloka, chaupai, doha

## Generating New Verses

**Use the `verse-generate` command with SDK 0.27.0+**

The SDK automates the complete workflow:
- Auto-detects next verse to generate (`--next` flag)
- Auto-generates scene descriptions (`--auto-generate-scene` flag)
- Creates verse file, image, audio, and embeddings automatically by default
- `--regenerate-content` only regenerates text — it suppresses image/audio unless combined with `--image --audio`
- Updates navigation links automatically
- Uses correct hyphenated filenames

**Recommended usage (auto-detect next verse):**
```bash
set -a && source .env && set +a
./venv/bin/verse-generate \
  --collection sundar-kaand \
  --next \
  --auto-generate-scene
```

**Generate specific verse:**
```bash
set -a && source .env && set +a
./venv/bin/verse-generate \
  --collection sundar-kaand \
  --verse chaupai-15 \
  --auto-generate-scene
```

**Verify generated files use hyphens:**
- `_verses/sundar-kaand/chaupai-15.md`
- `audio/sundar-kaand/chaupai-15-full.mp3`
- `audio/sundar-kaand/chaupai-15-slow.mp3`
- `images/sundar-kaand/modern-minimalist/chaupai-15.png`

**Then commit and push:**
```bash
git add _verses/ audio/ images/ data/
git commit -m "Generate chaupai-15 for Sundar Kaand

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
git push origin main
```

## Key Files to Update
**When adding verses:**
- Previous verse: Update `next_verse` field
- New verse: Fix permalink, verse_type, navigation, image path
- Scene descriptions: Add before generation
- **Important**: Don't include verse number in titles (e.g., "Hanuman's Resolve" not "Chaupai 13: Hanuman's Resolve") - UI displays numbers separately

**Collection index pages:**
- `sundar-kaand/index.html`: Displays verses in canonical sequence with section headers
- Uses Liquid to group by verse_type, showing section-specific counts

## Jekyll Collections & Liquid
- Verses in `_verses/` become `site.verses`
- Filter: `{% assign verses = site.verses | where: "collection_key", "sundar-kaand" | sort: "verse_number" %}`
- Audio paths auto-constructed in `_layouts/verse.html` using hyphens

## Git Workflow
- Always commit with: `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`
- Don't push unless explicitly asked
- Test locally first: `bundle exec jekyll serve --force_polling`

## Common Issues
1. **404 on images/audio**: Check file names use hyphens not underscores
2. **Verses not displaying**: Check collection_key, verse_type, permalink format
3. **Section counts wrong**: Verify verse_type field is set correctly (chaupai/doha/shloka)
4. **Embeddings not updating**: Re-run verse-generate command

## SDK Version
Currently using sanatan-verse-sdk 0.27.1 - upgrade regularly for new features and fixes.

**Recent updates:**
- 0.27.1: Minor fixes
- 0.27.0: `--all` flag no longer needed (verse-generate creates everything by default)
- 0.25.2: Package renamed from sanatan-sdk to sanatan-verse-sdk
- 0.21.0: Supports `data/themes/` location (Issue #5)
- 0.20.3: Supports `_data/collections.yml` (Issue #4), audio hyphen naming
- 0.20.2: Fixed validation bug (Issue #3)
- 0.20.0: Scene descriptions from `data/scenes/*.yml` (Issue #2)

## Python Commands
**ALWAYS run Python commands in the virtual environment:**
```bash
# Correct - uses venv
./venv/bin/verse-generate --collection sundar-kaand --verse 18 ...
./venv/bin/pip install --upgrade sanatan-verse-sdk

# Wrong - uses system Python
verse-generate --collection sundar-kaand --verse 18 ...
pip install --upgrade sanatan-verse-sdk
```

## Cost Per Verse
~$0.05-0.06 (AI content + image + audio + embeddings)

## Testing
```bash
bundle exec jekyll serve --force_polling
# Visit: http://localhost:4000/hanuman-gpt/
```
