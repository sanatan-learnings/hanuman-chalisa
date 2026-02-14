---
name: verse-generator
description: Generate complete verse content with multimedia (image, audio, embeddings) using sanatan-sdk. Automates verse creation for sacred text collections including Sundar Kaand, Hanuman Chalisa, etc. Use when creating new verses with Devanagari text, transliteration, meanings, translations, stories, images, and audio.
user-invocable: true
---

# Verse Generator

Automates the complete verse creation workflow for the Hanuman GPT project.

## What This Skill Does

Generates complete verse content including:
- ✅ Verse markdown files (Devanagari, transliteration, word meanings, translations, story, practical applications)
- ✅ Modern minimalist theme images (DALL-E 3, 1024x1536px)
- ✅ Audio pronunciations (full speed + slow speed via ElevenLabs TTS)
- ✅ Scene descriptions for image generation
- ✅ Vector embeddings for semantic search
- ✅ Navigation link updates between verses
- ✅ Git commit preparation

## Usage

Invoke this skill to create a new verse:

```
/verse-generator Create chaupai_05 for sundar-kaand
```

With verse text:

```
/verse-generator Create chaupai_05 for sundar-kaand with text: "सगर तीर एक भूधर सुंदर। कौतुक कूदि चढ़ेउ ता ऊपर।।"
```

Generate multimedia for existing verse:

```
/verse-generator Generate multimedia for chaupai_06 in sundar-kaand
```

## Prerequisites

Before using this skill, verify:
- ✅ Working in hanuman-gpt project directory
- ✅ sanatan-sdk installed in venv (`./venv/bin/pip install sanatan-sdk`)
- ✅ verse-* commands available: `./venv/bin/verse-generate`, `./venv/bin/verse-embeddings`, etc.
- ✅ `.env` file exists with API keys: `OPENAI_API_KEY` and `ELEVENLABS_API_KEY`
- ✅ Collection is enabled in `_data/collections.yml`

## Complete Workflow

### Step 1: Gather Verse Information

Ask the user for:
1. **Collection** (e.g., sundar-kaand, hanuman-chalisa, sankat-mochan-hanumanashtak)
2. **Verse identifier** (e.g., chaupai_05, verse_44, doha_02)
3. **Verse content**:
   - Devanagari text (required - can try to fetch from authoritative sources)
   - English title (required)
   - Hindi title (required)
   - Transliteration (optional - offer to create it)
   - Word meanings (optional - offer to research it)
   - Literal translation (optional - offer to create it)
   - Interpretive meaning (optional - offer to write it)
   - Story context (optional - offer to research it)
   - Practical applications (optional - offer to write it)

#### Option A: Fetch Devanagari Text Automatically (Experimental)

Try to fetch traditional Devanagari text from authoritative online sources:

```bash
set -a && source .env && set +a && \
./venv/bin/verse-fetch-text \
  --collection sundar-kaand \
  --verse chaupai_06 \
  --format json
```

If successful, use the fetched text. If not, ask user to provide it.

#### Option B: User Provides Text

If minimal information provided, offer AI assistance to research and draft complete content based on traditional interpretations.

### Step 2: Create Verse File

Create verse markdown at `_verses/<collection>/<verse_id>.md`:

```yaml
---
layout: verse
collection_key: "<collection>"
permalink: /<collection>/<verse_id>/
title_en: "<English Title>"
title_hi: "<Hindi Title>"
verse_number: <number>
previous_verse: "/<collection>/<previous_id>"
next_verse: null
image: "/images/<collection>/modern-minimalist/<verse_id>.png"

devanagari: |
  <Devanagari text>

transliteration: |
  <Transliteration>

phonetic_notes:
  - word: "<word>"
    phonetic: "<phonetic>"
    emphasis: "<emphasis>"

word_meanings:
  - word: "<word>"
    roman: "<roman>"
    meaning:
      en: "<English meaning>"
      hi: "<Hindi meaning>"

literal_translation:
  en: "<English literal translation>"
  hi: "<Hindi literal translation>"

interpretive_meaning:
  en: "<Interpretive meaning>"
  hi: "<Interpretive meaning in Hindi>"

story:
  en: "<Story context>"
  hi: "<Story context in Hindi>"

practical_application:
  teaching:
    en: "<Teaching>"
    hi: "<Teaching in Hindi>"
  when_to_use:
    en: "<When to use>"
    hi: "<When to use in Hindi>"
---
```

### Step 3: Update Previous Verse Navigation

If not the first verse:
1. Read the previous verse file
2. Update its `next_verse` field to point to this new verse

### Step 4: Add Scene Description

Add scene description to `docs/image-prompts/<collection>.md`:

```markdown
---

### Verse <N>: <Title>

**Scene Description**:
<Detailed scene with characters, setting, lighting, sacred symbols, emotional tone, spiritual energy, artistic style>
```

Follow existing scene descriptions in the file for style and detail level.

### Step 5: Generate Multimedia with verse-generate

Run the verse-generate command (use verse NUMBER, not ID):

```bash
set -a && source .env && set +a && \
./venv/bin/verse-generate \
  --collection <collection> \
  --verse <verse_number> \
  --all \
  --theme modern-minimalist

# Example: for chaupai_07, use --verse 7
./venv/bin/verse-generate \
  --collection sundar-kaand \
  --verse 7 \
  --all \
  --theme modern-minimalist
```

**Important**: The `--verse` argument expects a NUMBER (e.g., `7`), not the verse ID (e.g., `chaupai_07`).

This generates:
- Image: `images/<collection>/modern-minimalist/verse-NN.png` (rename to match convention)
- Audio: May fail if naming doesn't match - generate manually with `verse-audio --collection <collection> --verse <verse_id>`

### Step 6: Verify & Fix Naming Issues

**Common issues:**

1. **Image naming mismatch**: verse-generate creates `verse-NN.png` but you may need `chaupai-NN.png`
   ```bash
   mv images/<collection>/modern-minimalist/verse-07.png images/<collection>/modern-minimalist/chaupai-07.png
   ```

2. **Audio generation fails**: If verse-generate can't find the verse file, generate audio manually:
   ```bash
   set -a && source .env && set +a && \
   ./venv/bin/verse-audio --collection <collection> --verse <verse_id>

   # Example:
   ./venv/bin/verse-audio --collection sundar-kaand --verse chaupai_07
   ```

**Common naming patterns:**
- Sundar Kaand: `chaupai-01.png`, `chaupai_01_full.mp3`
- Hanuman Chalisa: `verse-01.png`, `verse_01_full.mp3`
- Opening verses: `doha_01.png`, `doha_01_full.mp3`

### Step 7: Regenerate Embeddings

Update embeddings for search:

```bash
set -a && source .env && set +a && \
./venv/bin/verse-embeddings \
  --multi-collection \
  --collections-file _data/collections.yml \
  --verses-dir _verses \
  --output data/embeddings.json
```

### Step 8: Verify Generated Files

List and verify all files:
- ✅ Verse file: `_verses/<collection>/<verse_id>.md`
- ✅ Image: `images/<collection>/modern-minimalist/<verse_id>.png` (~2-4 MB)
- ✅ Audio full: `audio/<collection>/<verse_id>_full.mp3` (~50-70 KB)
- ✅ Audio slow: `audio/<collection>/<verse_id>_slow.mp3` (~40-50 KB)
- ✅ Embeddings: `data/embeddings.json` (updated)
- ✅ Scene prompts: `docs/image-prompts/<collection>.md` (updated)
- ✅ Previous verse: Updated with next_verse link

### Step 9: Test & Commit

Suggest testing locally:
```bash
bundle exec jekyll serve
# Visit: http://localhost:4000/hanuman-gpt/<collection>/<verse_id>/
```

Ask if user wants to commit. If yes:
1. Run `git status` and `git diff --stat` to show changes
2. Stage relevant files
3. Create descriptive commit message
4. Commit with Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
5. Optionally push to remote

## Cost Per Verse

- **Image (standard)**: ~$0.04 (DALL-E 3)
- **Image (HD)**: ~$0.08 (DALL-E 3, if using --quality hd)
- **Audio (2 files)**: ~$0.0002 (ElevenLabs TTS)
- **Embeddings**: ~$0.00003 (OpenAI text-embedding-3-small)
- **Total**: ~$0.04 per verse (standard quality)

## Error Handling

**verse-generate fails:**
- Verify API keys in .env
- Check scene description exists in image-prompts file
- Verify theme configuration exists at `docs/themes/<collection>/modern-minimalist.yml`
- Check collection enabled in `_data/collections.yml`

**Embeddings fail:**
- Validate verse file YAML syntax
- Check all required fields present
- Verify OpenAI API key valid

**Image not generated:**
- Check scene description added to prompts file
- Verify OPENAI_API_KEY in .env
- Check theme configuration exists

**Audio not generated:**
- Verify ELEVENLABS_API_KEY in .env
- Check verse file has devanagari field
- Ensure ffmpeg installed (for slow speed: `brew install ffmpeg`)

## Important Notes

1. **Cultural sensitivity** - These are sacred texts; maintain authenticity and respect
2. **Preserve existing content** - Don't modify other verses accidentally
3. **Follow naming conventions** - Check existing files for patterns
4. **Verify image paths** - Ensure verse file path matches actual filename
5. **Test before committing** - Always suggest local testing first
6. **API costs** - Inform user of costs before generating multimedia

## Success Criteria

✅ Verse markdown file with complete, accurate content
✅ Scene description added to image-prompts file
✅ Image generated and correctly named (>1MB file size)
✅ Two audio files generated (full + slow)
✅ Embeddings updated with new verse
✅ Navigation links updated (previous verse → new verse)
✅ All files follow naming conventions
✅ Ready for local testing and git commit

## Documentation

For detailed setup and examples, see [README.md](README.md).
