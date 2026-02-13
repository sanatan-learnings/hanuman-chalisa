# Verse Generator Skill

Generate complete verse content with multimedia using verse-content-sdk.

## What This Skill Does

This skill automates the entire verse creation workflow:
1. **Create verse markdown file** with complete content (Devanagari, transliteration, meanings, translations, story, practical applications)
2. **Add scene description** to image prompts file
3. **Generate multimedia** using `verse-generate` command (images + audio)
4. **Update embeddings** for search functionality
5. **Update navigation** links between verses

## Prerequisites

Before running this skill, ensure:
- ✅ You're in a hanuman-gpt project directory
- ✅ verse-content-sdk is installed at `/Users/arungupta/workspaces/verse-content-sdk/.venv/bin/`
- ✅ `.env` file exists with `OPENAI_API_KEY` and `ELEVENLABS_API_KEY`
- ✅ You have the verse text content ready (Devanagari text, transliteration, etc.)

## Workflow

### Step 1: Gather Verse Information

Ask the user for:
1. **Collection** (e.g., sundar-kaand, hanuman-chalisa, sankat-mochan-hanumanashtak)
2. **Verse number/identifier** (e.g., chaupai_05, verse_44)
3. **Verse content**:
   - Devanagari text
   - English title
   - Hindi title
   - Transliteration (optional - you can help create it)
   - Word meanings (optional - you can help research it)
   - Translations (optional - you can help create it)
   - Story context (optional - you can help write it)
   - Practical applications (optional - you can help write it)

If the user provides minimal information (just the Devanagari text), offer to help research and draft the complete content based on traditional interpretations.

### Step 2: Create Verse File

Create the verse markdown file at `_verses/<collection>/<verse_id>.md` following this structure:

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
  en: "<Interpretive meaning in English>"
  hi: "<Interpretive meaning in Hindi>"

story:
  en: "<Story context in English>"
  hi: "<Story context in Hindi>"

practical_application:
  teaching:
    en: "<Teaching in English>"
    hi: "<Teaching in Hindi>"
  when_to_use:
    en: "<When to use in English>"
    hi: "<When to use in Hindi>"
---
```

### Step 3: Update Previous Verse Navigation

If this is not the first verse:
1. Read the previous verse file
2. Update its `next_verse` field to point to this new verse

### Step 4: Add Scene Description

Add a scene description to `docs/image-prompts/<collection>.md`:

```markdown
---

### Verse <N>: <Title>

**Scene Description**:
<Detailed scene description for image generation, including:
- Main subject/character(s) and their posture
- Setting and environment
- Lighting and atmosphere
- Sacred symbols and divine elements
- Emotional tone and spiritual energy
- Artistic style elements (luminous, ethereal, dramatic, etc.)>
```

Follow the existing scene descriptions in the file for style and detail level.

### Step 5: Generate Multimedia

Run the verse-generate command to create image and audio:

```bash
set -a && source .env && set +a && \
/Users/arungupta/workspaces/verse-content-sdk/.venv/bin/verse-generate \
  --collection <collection> \
  --verse <verse_id> \
  --all \
  --theme modern-minimalist
```

This generates:
- Image: `images/<collection>/modern-minimalist/<verse_id>.png`
- Audio: `audio/<collection>/<verse_id>_full.mp3` and `<verse_id>_slow.mp3`

### Step 6: Verify Image Naming

Check if the generated image filename matches the verse file's image path. If there's a mismatch (e.g., `verse-05.png` vs `chaupai-05.png`), rename it to match.

### Step 7: Regenerate Embeddings

Update embeddings for search functionality:

```bash
set -a && source .env && set +a && \
/Users/arungupta/workspaces/verse-content-sdk/.venv/bin/verse-embeddings \
  --multi-collection \
  --collections-file _data/collections.yml \
  --verses-dir _verses \
  --output data/embeddings.json
```

### Step 8: Verify & Test

1. List all generated files to confirm everything was created
2. Suggest testing locally: `bundle exec jekyll serve`
3. Provide the local URL to test: `http://localhost:4000/hanuman-gpt/<collection>/<verse_id>/`

### Step 9: Git Commit (Optional)

Ask if the user wants to commit the changes. If yes:
1. Run `git status` and `git diff` to show changes
2. Stage all relevant files
3. Create a descriptive commit message
4. Commit and optionally push

## Error Handling

- If verse-generate fails, check:
  - API keys are set in .env
  - Scene description exists in image-prompts file
  - Theme configuration exists
  - Collection is enabled in collections.yml
- If embeddings generation fails, verify the verse file YAML is valid
- If image naming is inconsistent, rename to match existing convention

## Cost Estimates

Per verse:
- **Image (standard)**: ~$0.04 (DALL-E 3)
- **Image (HD)**: ~$0.08 (DALL-E 3)
- **Audio**: ~$0.0002 (ElevenLabs, 2 files)
- **Embeddings**: ~$0.00003 (OpenAI, 2 embeddings)
- **Total (standard)**: ~$0.04 per verse

## Examples

### Example 1: Complete verse data provided
```
User: "Create verse 5 for sundar-kaand with this content: [provides full details]"
→ Create file, add scene, generate multimedia, update embeddings
```

### Example 2: Minimal data provided
```
User: "Create verse 6 for sundar-kaand: तुम्ह मम प्रिय..."
→ Ask: "Would you like me to help research and draft the complete content?"
→ If yes: Research traditional meanings, draft translations, create scene description
→ Generate multimedia and embeddings
```

### Example 3: Only multimedia needed
```
User: "Generate multimedia for existing chaupai_07"
→ Skip verse creation, add scene description, run verse-generate, update embeddings
```

## Important Notes

1. **Always preserve existing content** - Don't modify other verses accidentally
2. **Follow naming conventions** - Check existing files for patterns (chaupai vs verse)
3. **Verify image paths** - Ensure verse file image path matches actual filename
4. **Test before committing** - Always suggest local testing first
5. **Cultural sensitivity** - These are sacred texts; maintain authenticity and respect
6. **API costs** - Inform user of costs before generating multimedia

## Success Criteria

A successful verse generation includes:
✅ Verse markdown file with complete, accurate content
✅ Scene description added to image-prompts file
✅ Image generated (verify file size >1MB)
✅ Two audio files generated (full + slow)
✅ Embeddings updated with new verse
✅ Navigation links updated (previous verse points to new one)
✅ All files follow naming conventions
✅ Ready for git commit and local testing
