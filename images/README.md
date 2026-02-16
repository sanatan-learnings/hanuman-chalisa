# Images Directory

This directory contains themed visual representations for verses across multiple sacred text collections, organized by collection and theme.

## Multi-Collection Organization

Images are organized by collection first, then by theme:

```
images/
├── hanuman-chalisa/                  # Hanuman Chalisa collection (44 images per theme)
│   ├── modern-minimalist/
│   ├── kids-friendly/
│   └── traditional/
├── sundar-kaand/                     # Sundar Kaand collection (260+ images per theme)
│   └── modern-minimalist/
├── sankat-mochan-hanumanashtak/      # Sankat Mochan Hanumanashtak (8 images per theme)
│   └── modern-minimalist/
├── bajrang-baan/                     # Bajrang Baan collection (future)
│   └── modern-minimalist/
└── hanuman-gpt-title.png             # Main page branding image
```

**Note**: Previously there was a `modern-minimalist/` staging directory - this has been removed. Images now generate directly to collection-specific directories.

## Collection-Specific Details

### Hanuman Chalisa (44 images per theme)

**File naming:**
- **Opening dohas**: `opening-doha-01.png`, `opening-doha-02.png`
- **Main verses**: `verse-01.png` through `verse-40.png`
- **Closing doha**: `closing-doha.png`
- **Title page**: `title-page.png`

**Available themes:**
- ✅ **modern-minimalist**: Complete (44 images)
- ✅ **kids-friendly**: Complete (44 images)
- ✅ **traditional**: Complete (44 images)

### Sundar Kaand (260+ images per theme when complete)

**File naming:**
- **Chaupais**: `chaupai-01.png`, `chaupai-02.png`, ... (200+ chaupais)
- **Dohas**: `doha-01.png`, `doha-02.png`, ... (60+ dohas)

**Available themes:**
- 🚧 **modern-minimalist**: In progress (3 images)

### Bajrang Baan (future collection)

**Status**: Not yet started

## Image Specifications

- **Format**: PNG
- **Resolution**: 1024 × 1792 pixels (portrait orientation for sanatan-sdk)
- **Quality**: Standard or HD (DALL-E 3)
- **Content**: Scene-based depictions following collection-specific prompt files

## Generating New Images

### For New Collections

Use the [sanatan-sdk](https://pypi.org/project/sanatan-sdk/) for standardized image generation:

```bash
# 1. Create prompt file in docs/image-prompts/ following SDK format
# Example: docs/image-prompts/sankat-mochan-hanumanashtak.md
# Place this at: docs/image-prompts/<collection-key>.md

# 2. Create temporary image-prompts.md for SDK (it expects this name)
cp docs/image-prompts/sankat-mochan-hanumanashtak.md docs/image-prompts.md

# 3. Ensure OpenAI API key is set
export OPENAI_API_KEY=$(grep OPENAI_API_KEY .env | cut -d '=' -f2)

# 4. Generate images using collection key as theme-name
# SDK creates: images/<theme-name>/verse-01.png, verse-02.png, etc.
verse-images --theme-name sankat-mochan --style "modern minimalist spiritual art"

# 5. Move images to proper collection directory
mkdir -p images/sankat-mochan-hanumanashtak/modern-minimalist
mv images/sankat-mochan/verse-*.png images/sankat-mochan-hanumanashtak/modern-minimalist/
rmdir images/sankat-mochan

# 6. Clean up temporary file
rm docs/image-prompts.md

# 7. Update verse markdown files to reference images
# Add to frontmatter: image: "/images/<collection-key>/modern-minimalist/verse-01.png"
```

**Important Notes:**
- The SDK uses `--theme-name` parameter to create output directory: `images/<theme-name>/`
- Always use a shortened version of collection key (e.g., `sankat-mochan` for `sankat-mochan-hanumanashtak`)
- Then manually move to full collection path with theme subdirectory
- Keep prompt files named: `docs/<collection-key>-prompts.md` for clarity

**Prompt file format** (required by sanatan-sdk):
```markdown
### Verse 1: Title

**Scene Description**:
[Detailed DALL-E 3 prompt for the scene]

---

### Verse 2: Title

**Scene Description**:
[Another prompt]

---
```

### For Hanuman Chalisa Themes

Use the legacy generation script for consistency:

```bash
# Generate images for a theme
./scripts/generate_images.sh kids-friendly

# Resume from specific image if interrupted
./scripts/generate_images.sh kids-friendly --resume verse-15.png

# HD quality (2x cost)
./scripts/generate_images.sh kids-friendly --quality hd
```

## Cost Estimates

### Using sanatan-sdk (Sundar Kaand)
- **Standard quality**: $0.040/image
- **260 images**: $10.40 per theme
- **HD quality**: $0.080/image = $20.80 per theme

### Using legacy script (Hanuman Chalisa)
- **Standard quality**: $0.040/image × 44 = **$1.76 per theme**
- **HD quality**: $0.080/image × 44 = **$3.52 per theme**

## Directory Structure by Collection

### Hanuman Chalisa
```
images/hanuman-chalisa/modern-minimalist/
├── title-page.png
├── opening-doha-01.png
├── opening-doha-02.png
├── verse-01.png
├── verse-02.png
...
├── verse-40.png
└── closing-doha.png
```

### Sundar Kaand
```
images/sundar-kaand/modern-minimalist/
├── chaupai-01.png
├── chaupai-02.png
├── chaupai-03.png
...
├── doha-01.png
├── doha-02.png
...
```

## Adding a New Collection

1. **Create collection directory**:
   ```bash
   mkdir -p images/your-collection/modern-minimalist
   ```

2. **Create prompt file**: `docs/your-collection-prompts.md` following SDK format

3. **Generate images** using sanatan-sdk:
   ```bash
   verse-images --theme-name your-collection --style "your style description"
   ```

4. **Rename and move** images to collection directory with proper naming

5. **Update verse frontmatter** to reference images:
   ```yaml
   image: "/images/your-collection/modern-minimalist/verse-01.png"
   ```

6. **Add to collections.yml**: Enable the collection in `_data/collections.yml`

## Testing Your Images

1. **Build locally**:
   ```bash
   bundle exec jekyll serve
   ```

2. **Navigate to collection pages**:
   - `/hanuman-chalisa/` for Hanuman Chalisa
   - `/sundar-kaand/` for Sundar Kaand
   - Check individual verse pages

3. **Verify images**:
   - Display correctly on verse pages
   - No broken image links
   - Correct aspect ratio (portrait)
   - Test on mobile devices

4. **Check theme selector** (Hanuman Chalisa only for now):
   - Click theme dropdown (🎨) in header
   - Switch between themes
   - Verify theme persists after reload

## Best Practices

### Image Quality
- Use consistent resolution per collection
- Optimize file sizes (target 2-3 MB per image for DALL-E 3)
- Test on retina/high-DPI displays

### Artistic Consistency
- Maintain consistent style across all images in a theme
- Use cohesive color palette within collection
- Keep visual motifs recognizable

### Cultural Sensitivity
- Respect traditional Hindu iconography
- Avoid inappropriate representations
- Consider consulting cultural advisors

### File Organization
- Always organize by collection first, then theme
- Use consistent naming conventions per collection
- Keep staging area (`modern-minimalist/`) clean after moving images

## Troubleshooting

### Images Not Showing
- Check image path in verse frontmatter matches directory structure
- Verify collection directory exists: `images/{collection}/{theme}/`
- Clear browser cache and reload
- Check Jekyll build logs for missing file warnings

### Theme Selector Not Working
- Theme selector only works for Hanuman Chalisa currently
- Other collections use single theme for now
- Verify `_data/themes.yml` matches directory structure

### sanatan-sdk Generation Issues
- Ensure prompt file follows exact format (see example above)
- Check `**Scene Description**:` heading spelling/format
- Verify OpenAI API key is set correctly
- Images generate to `images/modern-minimalist/` by default - move manually

### Slow Image Loading
- Large DALL-E 3 images (2-3 MB) are normal
- Consider lazy loading for collections with many images
- Test on slower connections

## Resources

- **Sundar Kaand prompts**: [docs/image-prompts.md](../docs/image-prompts.md)
- **Hanuman Chalisa prompts**: [docs/image-prompts.md](../docs/image-prompts.md)
- **Theme specs**: [data/themes/](../data/themes/)
- **Generation scripts**: [scripts/generate_images.sh](../scripts/generate_images.sh)
- **sanatan-sdk**: [PyPI](https://pypi.org/project/sanatan-sdk/)
- **Developer guide**: [docs/developer-guide.md](../docs/developer-guide.md)
