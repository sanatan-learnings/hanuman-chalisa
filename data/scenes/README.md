# Scene Descriptions

This directory contains **theme-agnostic scene descriptions** for image generation across all collections.

## Purpose

Scene descriptions capture the **narrative and spiritual meaning** of each verse, independent of visual style. They describe:
- **Action**: What is happening in the scene
- **Characters**: Who is present and their roles
- **Setting**: Where the scene takes place
- **Spiritual significance**: The deeper meaning

## Format

Each collection has a YAML file: `{collection}.yml`

```yaml
_meta:
  collection: hanuman-chalisa
  source: Original scene descriptions
  description: Scene descriptions for image generation
  format: theme-agnostic scene descriptions

scenes:
  verse-01:
    title: "Ocean of Knowledge and Virtues"
    description: |
      Hanuman standing in a majestic pose, radiating divine light that
      illuminates all three realms - heaven, earth, and the netherworld...

  verse-02:
    title: "Rama's Messenger"
    description: |
      Hanuman in dynamic motion - flying or leaping across the sky...
```

## How It Works

**Scene descriptions** (this directory) + **Theme specifications** (`data/themes/{collection}/*.yml`) = **Complete DALL-E 3 prompts**

- Scene descriptions are **content-focused** (what happens, who, where, why)
- Theme specifications are **style-focused** (colors, artistic style, composition)
- The SDK combines both to create final image prompts

## Usage

### With verse-generate (SDK)

The SDK reads scene descriptions from this directory when generating images:

```bash
verse-generate --collection hanuman-chalisa --verse 1 --image
```

The SDK:
1. Reads scene from `data/scenes/hanuman-chalisa.yml` → `scenes.verse-01`
2. Reads theme from `data/themes/hanuman-chalisa/modern-minimalist.yml`
3. Combines them into a complete DALL-E 3 prompt
4. Generates the image

### Scene Description Guidelines

When writing scene descriptions:

1. **Be specific but theme-agnostic**
   - ✅ "Hanuman standing on a mountain peak"
   - ❌ "Hanuman in a minimalist art style" (that's theme)

2. **Focus on narrative elements**
   - Action, characters, setting, mood
   - Spiritual and symbolic meaning
   - Key visual elements (objects, poses, relationships)

3. **Length: 50-200 words**
   - Detailed enough for AI to understand
   - Concise enough to stay focused

4. **Use present tense**
   - "Hanuman flies" not "Hanuman flew"

## Migration from Markdown

**Old location:** `docs/image-prompts/{collection}.md`
**New location:** `data/scenes/{collection}.yml`

Converted using `scripts/convert_scenes_to_yaml.py`

### Why YAML?

- ✅ Structured data (easier for SDK to parse)
- ✅ Consistent with other source files (`data/verses/*.yml`)
- ✅ Better for programmatic access
- ✅ Clearer separation of metadata and content

### Why data/scenes/?

- ✅ Logical grouping: All **source data** in `data/`
- ✅ Parallel structure: `data/verses/` and `data/scenes/`
- ✅ Intuitive: "Where are scene descriptions?" → "In data/ with other sources"
- ✅ Separated from generated output (audio/, images/, _verses/)

## Collections

- `hanuman-chalisa.yml` - 43 scenes (2 dohas + 40 verses + 1 closing)
- `sundar-kaand.yml` - 18 scenes (3 shlokas + 13 chaupais + 2 dohas)
- `sankat-mochan-hanumanashtak.yml` - 9 scenes (8 padas + title)

## Related

- Canonical verse text: `data/verses/{collection}.yml`
- Visual themes: `data/themes/{collection}/*.yml`
- Generated images: `images/{collection}/{theme}/`
- Collection metadata: `_data/collections.yml`
