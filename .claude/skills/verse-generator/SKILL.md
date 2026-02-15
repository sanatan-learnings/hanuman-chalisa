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

**🚀 Quick Start - Generate Next Verse (Recommended):**

```
/verse-generator Generate next verse for sundar-kaand
```

```
/verse-generator Generate next verse for hanuman-chalisa
```

```
/verse-generator Generate next verse for sankat-mochan-hanumanashtak
```

The `--next` flag auto-detects the last generated verse and creates the next one in sequence. Perfect for continuing work on any collection!

**Other Usage Patterns:**

Create a specific verse:

```
/verse-generator Create chaupai-05 for sundar-kaand
```

Generate multimedia for existing verse:

```
/verse-generator Generate multimedia for chaupai-06 in sundar-kaand
```

**Batch Processing (SDK 0.16.0+):**

Regenerate multiple verses at once:

```
/verse-generator Regenerate verses 1-10 for sundar-kaand
```

Or specific range:

```
/verse-generator Regenerate verses 5-8 for hanuman-chalisa
```

## Prerequisites

Before using this skill, verify:
- ✅ Working in hanuman-gpt project directory
- ✅ **sanatan-sdk 0.16.0+** installed in venv (`./venv/bin/pip install --upgrade sanatan-sdk`)
- ✅ verse-* commands available: `./venv/bin/verse-generate`, `./venv/bin/verse-embeddings`, etc.
- ✅ `.env` file exists with API keys: `OPENAI_API_KEY` and `ELEVENLABS_API_KEY`
- ✅ Collection is enabled in `_data/collections.yml`
- ✅ Canonical verse text exists in `data/verses/<collection>.yml` (required for --regenerate-content)

## Complete Workflow

**IMPORTANT**: SDK 0.16.0+ can automatically generate ALL content from canonical YAML sources. Use `--regenerate-content` flag!

**NEW in SDK 0.11.0**: Batch processing support! Use `--verse M-N` syntax to regenerate multiple verses at once (e.g., `--verse 1-10`, `--verse 5-20`).

### Step 1: Verify Canonical Source

Check if canonical verse text exists:
1. **Collection** (e.g., sundar-kaand, hanuman-chalisa, sankat-mochan-hanumanashtak)
2. **Verse identifier** (e.g., chaupai_05, verse_44, doha_02)
3. **Canonical YAML**: Verify verse exists in `data/verses/<collection>.yml`

If canonical source exists (e.g., `data/verses/sundar-kaand.yml`), the SDK will:
- ✅ Read Devanagari text from canonical YAML
- ✅ Auto-generate transliteration
- ✅ Auto-generate word meanings (English & Hindi)
- ✅ Auto-generate literal translation
- ✅ Auto-generate interpretive meaning
- ✅ Auto-generate story context
- ✅ Auto-generate practical applications

**No manual content creation needed!** The SDK uses AI to generate everything from the canonical Devanagari text.

### Step 2: Generate Complete Verse with SDK (SDK 0.16.0+)

**🚀 Recommended: Use `--next` to auto-generate the next verse:**

```bash
set -a && source .env && set +a && \
./venv/bin/verse-generate \
  --collection <collection> \
  --next \
  --regenerate-content \
  --all

# Example: Generate next verse for sundar-kaand
set -a && source .env && set +a && \
./venv/bin/verse-generate \
  --collection sundar-kaand \
  --next \
  --regenerate-content \
  --all
```

The `--next` flag automatically:
- ✅ Detects the last generated verse in the collection
- ✅ Finds the next verse ID in the sequence from canonical YAML
- ✅ Creates proper hyphenated filenames (chaupai-16, pada-09, etc.)
- ✅ No need to specify verse numbers or IDs manually!

**Alternative: Generate a specific verse:**

```bash
set -a && source .env && set +a && \
./venv/bin/verse-generate \
  --collection sundar-kaand \
  --verse chaupai-15 \
  --regenerate-content \
  --all
```

**Batch Processing (NEW in SDK 0.11.0):**
```bash
set -a && source .env && set +a && \
./venv/bin/verse-generate \
  --collection <collection> \
  --verse <M-N> \
  --regenerate-content \
  --all

# Example: Regenerate verses 1-10 for sundar-kaand
set -a && source .env && set +a && \
./venv/bin/verse-generate \
  --collection sundar-kaand \
  --verse 1-10 \
  --regenerate-content \
  --all
```

**What this does:**
1. ✅ Reads Devanagari from `data/verses/<collection>.yml` for each verse in range
2. ✅ Generates transliteration, word meanings, translations, story, practical applications using AI
3. ✅ Creates/updates `_verses/<collection>/<verse_id>.md` with all content
4. ✅ Generates image using DALL-E 3 (from scene description in `docs/image-prompts/<collection>.md`)
5. ✅ Generates audio pronunciations (full + slow speed)
6. ✅ Updates embeddings for semantic search

**Parameters:**
- `--verse <N>`: Single verse number (e.g., 3 for chaupai_03)
- `--verse <M-N>`: Verse range (e.g., 1-10, 5-20) - batch processing
- `--verse-id <ID>`: Verse identifier (e.g., chaupai_03, verse_05, doha_01) - only for single verse
- `--regenerate-content`: Generate AI content from canonical YAML
- `--all`: Generate both image and audio
- `--theme modern-minimalist`: Theme for image generation (optional, defaults to modern-minimalist)

**Note**: When using batch processing (`--verse M-N`), do NOT specify `--verse-id`. The SDK will auto-detect verse IDs from existing files or canonical YAML sequence.

### Step 3: Verify Scene Description Exists

**Before running verse-generate**, ensure scene description exists in `docs/image-prompts/<collection>.md`:

```markdown
---

### Verse <N>: <Title>

**Scene Description**:
<Detailed scene with characters, setting, lighting, sacred symbols, emotional tone, spiritual energy, artistic style>
```

Follow existing scene descriptions in the file for style and detail level. The SDK will use this to generate the image.

### Step 4: Update Previous Verse Navigation (Manual)

If not the first verse:
1. Read the previous verse file
2. Update its `next_verse` field to point to this new verse

### Step 5: Verify Generated Files

List and verify all files generated by SDK:
- ✅ Verse file: `_verses/<collection>/<verse_id>.md` (with AI-generated content)
- ✅ Image: `images/<collection>/modern-minimalist/verse-NN.png` (~2-4 MB)
- ✅ Embeddings: `data/embeddings.json` (updated)

**Note**: Audio generation may fail due to naming issues in SDK 0.8.3. If audio is missing, it can be generated later.

### Step 6: Test & Commit

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

## Cost Per Verse (SDK 0.16.0+)

- **AI Content Generation**: ~$0.01-0.02 (GPT-4 for transliteration, meanings, translations, story, practical applications)
- **Image (standard)**: ~$0.04 (DALL-E 3)
- **Image (HD)**: ~$0.08 (DALL-E 3, if using --quality hd)
- **Audio (2 files)**: ~$0.0002 (ElevenLabs TTS)
- **Embeddings**: ~$0.00003 (OpenAI text-embedding-3-small)
- **Total**: ~$0.05-0.06 per verse (standard quality with AI content generation)

**Batch Processing Costs:**
- 10 verses: ~$0.50-0.60
- 20 verses: ~$1.00-1.20
- 40 verses (full Hanuman Chalisa): ~$2.00-2.40

## Error Handling

**--regenerate-content fails:**
- Ensure sanatan-sdk 0.11.0+ is installed
- Verify canonical YAML exists: `data/verses/<collection>.yml`
- Check verse ID exists in canonical YAML (e.g., `chaupai_03`)
- Verify OPENAI_API_KEY in .env for AI content generation

**Batch processing fails:**
- Verify all verses in range exist in canonical YAML
- Check verse IDs can be auto-detected from existing files or canonical sequence
- Do NOT use `--verse-id` with batch processing
- Ensure sufficient API rate limits for batch operations

**verse-generate fails:**
- Verify API keys in .env (OPENAI_API_KEY, ELEVENLABS_API_KEY)
- Check scene description exists in `docs/image-prompts/<collection>.md`
- Verify theme configuration exists at `docs/themes/<collection>/modern-minimalist.yml`
- Check collection enabled in `_data/collections.yml`

**Image not generated:**
- Check scene description added to prompts file
- Verify OPENAI_API_KEY in .env
- Check theme configuration exists

**Audio not generated:**
- Verify ELEVENLABS_API_KEY in .env
- Ensure ffmpeg installed (for slow speed: `brew install ffmpeg`)
- Check verse file exists before audio generation
- For batch processing, audio generation happens sequentially

**Embeddings fail:**
- Validate verse file YAML syntax
- Check all required fields present
- Verify OPENAI_API_KEY valid

## Important Notes

1. **🚀 Prefer `--next` flag** - Auto-detects next verse to generate, no manual verse IDs needed! Simplest workflow for continuing any collection.
2. **Use SDK 0.16.0+ only** - Earlier versions lack `--next` flag and batch processing support
3. **Canonical YAML required** - Verse must exist in `data/verses/<collection>.yml` before using --regenerate-content
4. **Cultural sensitivity** - These are sacred texts; maintain authenticity and respect in AI-generated content
5. **Never manually create content** - Always use SDK `--regenerate-content` to generate from canonical source
6. **Preserve existing content** - Don't modify other verses accidentally
7. **Follow naming conventions** - Use hyphens (chaupai-01, pada-01, doha-01, shloka-01), never underscores
8. **Test before committing** - Always suggest local testing first
9. **API costs** - Inform user of costs before generating multimedia (~$0.05-0.06 per verse, more for batch)
10. **Batch processing** - Use `--verse M-N` syntax for ranges, or `--next` for sequential generation
11. **Rate limits** - Be mindful of OpenAI/ElevenLabs rate limits when processing large batches

## Success Criteria (SDK 0.16.0+)

✅ Canonical verse text exists in `data/verses/<collection>.yml`
✅ SDK successfully generated AI content with `--regenerate-content`
✅ Verse markdown file(s) created with:
  - Devanagari text (from canonical source)
  - Transliteration (AI-generated)
  - Word meanings (AI-generated, English & Hindi)
  - Literal translation (AI-generated)
  - Interpretive meaning (AI-generated)
  - Story context (AI-generated)
  - Practical applications (AI-generated)
✅ Image(s) generated (>1MB file size each)
✅ Audio files generated (full + slow speed)
✅ Embeddings updated
✅ Navigation links updated (for single verse creation)
✅ Ready for local testing and git commit

**Batch Processing Success:**
- All verses in range processed successfully
- No partial failures (if any fail, review and retry)
- Git commits organized logically (consider one commit per verse or batch)

## Documentation

For detailed setup and examples, see [README.md](README.md).
