# Image Prompts Directory

This directory contains scene descriptions for DALL-E 3 image generation, organized by collection.

## Structure

```
docs/image-prompts/
├── README.md                          (this file)
├── hanuman-chalisa.md                 (44 images: dohas + 40 verses + closing)
├── sankat-mochan-hanumanashtak.md     (8 images: 8 verses)
└── sundar-kaand.md                    (260+ images: chaupais + dohas)
```

## File Format

Each prompt file follows the sanatan-sdk format:

```markdown
# Collection Name - Scene Descriptions for DALL-E 3

Brief style description for the collection...

---

### Verse 1: Title

**Scene Description**:
Detailed DALL-E 3 prompt describing what should appear in the image...

---

### Verse 2: Title

**Scene Description**:
Another detailed prompt...

---
```

## Naming Convention

- **File name**: `<collection-key>.md` (matches collection key in `_data/collections.yml`)
- **Examples**:
  - `hanuman-chalisa.md` → hanuman-chalisa collection
  - `sankat-mochan-hanumanashtak.md` → sankat-mochan-hanumanashtak collection
  - `sundar-kaand.md` → sundar-kaand collection

## Usage with sanatan-sdk

The SDK expects a file named `docs/image-prompts.md` (singular), so create a temporary copy:

```bash
# 1. Copy the collection-specific prompts
cp docs/image-prompts/sankat-mochan-hanumanashtak.md docs/image-prompts.md

# 2. Generate images
verse-images --theme-name sankat-mochan --style "modern minimalist spiritual art"

# 3. Clean up temporary file
rm docs/image-prompts.md
```

## Relationship to Theme Files

**Two types of files work together:**

1. **Scene Descriptions** (this directory) → What happens in the image
   - `docs/image-prompts/<collection>.md`
   - Describes characters, actions, setting, spiritual meaning
   - Theme-agnostic narrative descriptions

2. **Theme Specifications** → How it should look visually
   - `docs/themes/<collection>/<theme-name>.yml`
   - Defines colors, style, lighting, artistic approach
   - Multiple themes can use the same scene descriptions

**Combined**: Scene Description + Theme Specification = Complete DALL-E 3 Prompt

## Writing Good Scene Descriptions

### Do:
- ✅ Describe the narrative moment and spiritual significance
- ✅ Specify character positions, poses, and expressions
- ✅ Include atmospheric elements (lighting suggestions, mood)
- ✅ Mention key symbolic elements (lotus, divine light, sacred geometry)
- ✅ Keep descriptions 50-150 words per scene

### Don't:
- ❌ Specify exact colors (that's in theme files)
- ❌ Include style modifiers like "modern" or "traditional" (theme handles this)
- ❌ Over-describe technical camera angles
- ❌ Include character design details (consistent across collection)

## Adding a New Collection

1. **Create prompt file**: `docs/image-prompts/<new-collection>.md`
2. **Follow format**: Use existing files as templates
3. **Create theme spec**: `docs/themes/<new-collection>/modern-minimalist.yml`
4. **Test generation**: Use sanatan-sdk to generate sample images
5. **Commit both**: Prompt file and theme file together

## See Also

- [Theme Files Directory](../themes/README.md)
- [Image Generation Workflow](../themes/generation-workflow.md)
- [Images Directory](../../images/README.md)
- [sanatan-sdk](https://github.com/sanatan-learnings/sanatan-sdk)
