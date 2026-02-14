# Verse Generator Skill

A Claude Skill that automates the complete workflow for creating verses with multimedia content using sanatan-sdk.

## Installation

This skill is located in the project at `.claude/skills/verse-generator/`

To make it available as a slash command, create a symlink:

```bash
mkdir -p ~/.claude/skills
ln -s "$(pwd)/.claude/skills/verse-generator" ~/.claude/skills/verse-generator
```

Or copy it to the global skills directory:

```bash
cp -r .claude/skills/verse-generator ~/.claude/skills/
```

## Usage

Invoke the skill using the slash command:

```
/verse-generator
```

Or with arguments:

```
/verse-generator Create verse 5 for sundar-kaand
```

**Batch Processing (SDK 0.11.0+):**

```
/verse-generator Regenerate verses 1-10 for sundar-kaand
```

```
/verse-generator Regenerate verses 5-20 for hanuman-chalisa
```

## What It Does

1. **Guides verse creation** - Helps create complete verse markdown with all content fields
2. **Adds scene descriptions** - Automatically adds image generation prompts
3. **Generates multimedia** - Runs `verse-generate --all` to create images and audio
4. **Updates embeddings** - Regenerates search embeddings with new verse
5. **Fixes navigation** - Links previous verse to new one
6. **Commits changes** - Optionally commits everything to git
7. **Batch processing** - Regenerate multiple verses at once with `--verse M-N` syntax (SDK 0.11.0+)

## Understanding the Tools

### `/verse-generator` (Claude Code Skill) vs `verse-generate` (SDK Command)

**When to use `/verse-generator` (this skill):**
- ✅ You want a **guided, automated workflow**
- ✅ Includes verification steps (canonical source, scene descriptions, navigation)
- ✅ Shows git status and handles commits automatically
- ✅ Provides safety checks and error handling
- ✅ Best for **interactive use** in Claude Code sessions

**When to use `verse-generate` (SDK command directly):**
- ✅ You want **direct control** over the process
- ✅ You're **scripting** or automating in bash/CI/CD
- ✅ You only need the core regeneration (no git workflow)
- ✅ You're debugging or testing specific SDK features

**How they relate:**
```
┌─────────────────────────────────────┐
│  /verse-generator (Claude Skill)   │  ← Workflow automation layer
├─────────────────────────────────────┤
│  • Verifies prerequisites           │
│  • Calls verse-generate             │  ← Uses SDK underneath
│  • Verifies output                  │
│  • Manages git commits              │
└─────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  verse-generate (SDK command)       │  ← Core tool
├─────────────────────────────────────┤
│  • Reads canonical YAML             │
│  • Generates AI content             │
│  • Creates verse files              │
│  • Generates multimedia             │
│  • Updates embeddings               │
└─────────────────────────────────────┘
```

**Example:**

```bash
# Option 1: Use the skill (recommended for interactive work)
/verse-generator regenerate chaupai_05 for sundar-kaand

# Option 2: Use SDK directly (for scripting)
./venv/bin/verse-generate \
  --collection sundar-kaand \
  --verse 5 \
  --verse-id chaupai_05 \
  --regenerate-content \
  --all

# Option 3: Batch processing (SDK 0.11.0+)
./venv/bin/verse-generate \
  --collection sundar-kaand \
  --verse 1-10 \
  --regenerate-content \
  --all
```

## Prerequisites

- Working in a hanuman-gpt project directory
- **sanatan-sdk 0.11.0+** installed in local venv (`./venv/bin/verse-generate`)
- `.env` file with API keys:
  - `OPENAI_API_KEY` (for images and embeddings)
  - `ELEVENLABS_API_KEY` (for audio)

## Example Workflows

### Create New Verse with Full Content

```
User: /verse-generator Create chaupai_05 for sundar-kaand
Claude: I'll help you create the 5th chaupai. Please provide:
        1. Devanagari text
        2. English title
        3. Hindi title
        [guides through complete creation]
```

### Generate Multimedia for Existing Verse

```
User: /verse-generator Generate multimedia for chaupai_07 in sundar-kaand
Claude: [Adds scene description, runs verse-generate, updates embeddings]
```

### AI-Assisted Content Creation

```
User: /verse-generator Create verse 44 for hanuman-chalisa with text: "पवन तनय..."
Claude: Would you like me to help research and draft the complete content?
        [Helps with transliteration, meanings, translations, story, applications]
```

### Batch Regeneration

```
User: /verse-generator Regenerate verses 1-10 for sundar-kaand
Claude: [Processes all 10 verses in sequence, generating content, images, audio]
        This will cost approximately $0.50-0.60 for 10 verses.
        [Shows progress and results for each verse]
```

## Cost Per Verse

- AI Content Generation: ~$0.01-0.02
- Image (standard): ~$0.04
- Image (HD): ~$0.08
- Audio (2 files): ~$0.0002
- Embeddings: ~$0.00003
- **Total: ~$0.05-0.06 per verse**

**Batch Processing:**
- 10 verses: ~$0.50-0.60
- 20 verses: ~$1.00-1.20
- 40 verses: ~$2.00-2.40

## Generated Files

Each verse generation creates:
- `_verses/<collection>/<verse_id>.md` - Verse content
- `images/<collection>/modern-minimalist/<verse_id>.png` - AI image
- `audio/<collection>/<verse_id>_full.mp3` - Full speed audio
- `audio/<collection>/<verse_id>_slow.mp3` - Slow speed audio
- `data/embeddings.json` - Updated embeddings

## Features

✅ Complete verse creation workflow automation
✅ AI assistance for content research and drafting
✅ Automatic scene description generation
✅ Multimedia generation (images + audio)
✅ Embedding updates for search
✅ Navigation link management
✅ Git commit helper
✅ Cost tracking and estimates
✅ Error handling and validation
✅ **Batch processing** (SDK 0.11.0+) - regenerate multiple verses at once

## Tips

1. **Have verse text ready** - At minimum, provide the Devanagari text
2. **Review before committing** - Always test locally first (`bundle exec jekyll serve`)
3. **Check naming conventions** - The skill will match existing patterns (chaupai vs verse)
4. **Use AI assistance** - Let Claude help research meanings and context if needed
5. **Verify multimedia** - Check image quality and audio pronunciation
6. **Batch processing** - Use for regenerating multiple verses efficiently (SDK 0.11.0+)
7. **API rate limits** - Be mindful of rate limits when processing large batches

## Troubleshooting

**Skill not found:**
```bash
ls ~/.claude/skills/verse-generator/
```

**API key errors:**
```bash
cat .env | grep -E "OPENAI|ELEVENLABS"
```

**SDK not found:**
```bash
ls /Users/arungupta/workspaces/sanatan-sdk/.venv/bin/verse-generate
```

## Related Commands

Direct SDK usage (without skill):
```bash
# List collections
verse-generate --list-collections

# Generate multimedia for single verse
verse-generate --collection sundar-kaand --verse 5 --verse-id chaupai_05 --all

# Batch processing (SDK 0.11.0+)
verse-generate --collection sundar-kaand --verse 1-10 --regenerate-content --all

# Regenerate embeddings
verse-embeddings --multi-collection
```

## Files

- `skill.json` - Skill metadata
- `instructions.md` - Complete workflow instructions for Claude
- `README.md` - This file (user documentation)

## Version

1.0.0 - Initial release

## Author

Arun Gupta

## License

MIT
