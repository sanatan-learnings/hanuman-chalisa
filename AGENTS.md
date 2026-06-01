# Claude Code Guide - Hanuman GPT

## Project Overview
Jekyll-based website for sacred Hindu texts with multimedia content (images, audio, embeddings). Currently contains Hanuman Chalisa, Sundar Kaand, Sankat Mochan Hanumanashtak, Bajrang Baan, and Hanuman Bahuk; Hanuman Stuti and Hanuman Kavacham are planned.

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
  ├── sources/{collection}.txt   # Input: Definitive raw text (authoritative source, hand-added)
  ├── verses/{collection}.yml    # Source: Canonical verse text, parsed from data/sources/ (Devanagari)
  ├── scenes/{collection}.yml    # Source: Scene descriptions for image generation
  └── themes/{collection}/*.yml  # Config: Image generation settings
```

## Content Pipeline (start here for a NEW collection)
The definitive text is the *beginning* of the pipeline, not `data/verses/`:
```
data/sources/{collection}.txt   →   data/verses/{collection}.yml   →   _verses/ + audio/ + images/ + embeddings
   (1) paste authoritative          (2) parse into structured           (3) verse-generate (SDK)
       raw text + provenance            verses w/ _meta.sequence
```
1. **Add the definitive text** to `data/sources/{collection}.txt` with a provenance header (source URL, date, structure, editorial notes). See `data/sources/README.md`.
2. **Parse into structured verses** at `data/verses/{collection}.yml` (`_meta.sequence` + per-verse `devanagari`). Use/extend a parser in `scripts/` or hand-structure for short texts.
3. **Generate** with `verse-generate` (see below), then enable the collection in `_data/collections.yml` (`enabled: true`).

Full walkthrough: [docs/guides/adding-a-collection.md](docs/guides/adding-a-collection.md).

## Verse Types & Numbering
- **Hanuman Chalisa**: doha-01, doha-02, chaupai-01 to chaupai-40, doha-closing
- **Sundar Kaand**: shloka_01-03, chaupai_01-522, doha_01-58 (underscore in YAML, hyphen in files)
- `verse_number`: Global sequence number (e.g., 15 for chaupai_11 in Sundar Kaand)
- `verse_type`: shloka, chaupai, doha

## Generating New Verses
`verse-generate` (SDK 0.27.0+) creates the verse file, image, audio, embeddings, and nav links in one step, with correct hyphenated names.

```bash
set -a && source .env && set +a
./venv/bin/verse-generate --collection sundar-kaand --next --auto-generate-scene
```
- `--next` auto-detects the next verse from `_meta.sequence`; or target one with `--verse chaupai-15`.
- `--auto-generate-scene` writes the scene description before generating.
- `--regenerate-content` regenerates text only (suppresses image/audio unless combined with `--image --audio`).
- Cost ~$0.05–0.06/verse (content + image + audio + embeddings).

Full options + the per-media commands (`verse-images`/`verse-audio`/`verse-embeddings`): [docs/guides/content-generation.md](docs/guides/content-generation.md).

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
5. **Image generation 400 "Unknown parameter: 'style'" / "dall-e-3 does not exist"**: `dall-e-3` is retired. The SDK image module hardcodes `dall-e-3` + `style` + URL download; current accounts only have `gpt-image-1` (rejects `style`, different size/quality values, returns base64). Patch `verse_sdk/images/generate_theme_images.py` to use `gpt-image-1` (size `1024x1536`, quality `low|medium|high`, drop `style`, decode `b64_json`) and set the theme's `dalle_params` accordingly. Upstream SDK fix needed.
6. **`verse-embeddings --collection` rewrites index.json schema**: single-collection mode rewrites the manifest to a `collections:[]` schema containing only that collection, dropping others. Either run `--multi-collection`, or hand-append to the existing `files:[]` array (the reader in `assets/js/guidance.js` prefers `files` when present).
7. **Audio fails with `quota_exceeded`**: ElevenLabs monthly character quota hit. The SDK leaves 0-byte `.mp3` and `.temp.mp3` files behind — delete them, top up credits, and re-run `verse-audio --collection {collection}`.

## SDK Version
Currently using sanatan-verse-sdk 0.102.0 — upgrade regularly: `./venv/bin/pip install --upgrade sanatan-verse-sdk`. Version history: [SDK releases](https://github.com/sanatan-learnings/sanatan-verse-sdk/releases).

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

## Testing
```bash
bundle exec jekyll serve --force_polling
# Visit: http://localhost:4000/
```
