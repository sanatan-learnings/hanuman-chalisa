# Verse Generator Skill

A Claude Skill that automates the complete workflow for creating verses with multimedia content using verse-content-sdk.

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

## What It Does

1. **Guides verse creation** - Helps create complete verse markdown with all content fields
2. **Adds scene descriptions** - Automatically adds image generation prompts
3. **Generates multimedia** - Runs `verse-generate --all` to create images and audio
4. **Updates embeddings** - Regenerates search embeddings with new verse
5. **Fixes navigation** - Links previous verse to new one
6. **Commits changes** - Optionally commits everything to git

## Prerequisites

- Working in a hanuman-gpt project directory
- verse-content-sdk installed at `/Users/arungupta/workspaces/verse-content-sdk/.venv/bin/`
- `.env` file with API keys:
  - `OPENAI_API_KEY` (for images)
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

## Cost Per Verse

- Image (standard): ~$0.04
- Image (HD): ~$0.08
- Audio (2 files): ~$0.0002
- Embeddings: ~$0.00003
- **Total: ~$0.04 per verse**

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

## Tips

1. **Have verse text ready** - At minimum, provide the Devanagari text
2. **Review before committing** - Always test locally first (`bundle exec jekyll serve`)
3. **Check naming conventions** - The skill will match existing patterns (chaupai vs verse)
4. **Use AI assistance** - Let Claude help research meanings and context if needed
5. **Verify multimedia** - Check image quality and audio pronunciation

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
ls /Users/arungupta/workspaces/verse-content-sdk/.venv/bin/verse-generate
```

## Related Commands

Direct SDK usage (without skill):
```bash
# List collections
verse-generate --list-collections

# Generate multimedia
verse-generate --collection sundar-kaand --verse chaupai_05 --all

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
