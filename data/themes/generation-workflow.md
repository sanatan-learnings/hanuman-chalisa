# Theme Generation Workflow

Generate theme images using [sanatan-verse-sdk](https://github.com/sanatan-learnings/sanatan-verse-sdk).

## Quick Start

```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install SDK
pip install sanatan-verse-sdk

# Generate all images
verse-images --theme-name traditional
```

## How It Works

Theme YAML files in `data/themes/<collection-key>/` include generation settings:

```yaml
theme:
  generation:
    style_modifier: |
      Traditional Indian devotional art with vermillion red,
      gold accents, intricate details...
    dalle_params:
      quality: "hd"
      size: "1024x1792"
```

The SDK automatically reads these settings and generates all 44 images.

## Common Commands

```bash
# Generate all images
verse-images --theme-name modern-minimalist

# HD quality (2x cost)
verse-images --theme-name traditional --quality hd

# Resume from specific image
verse-images --theme-name my-theme --start-from verse-15.png

# Regenerate specific images
verse-images --theme-name my-theme --regenerate verse-05.png,verse-10.png

# Force regenerate all (with confirmation)
verse-images --theme-name my-theme --force

# Override style
verse-images --theme-name my-theme --style "custom style"
```

## Creating a New Theme

1. **Copy theme template:**
   ```bash
   cp data/themes/hanuman-chalisa/modern-minimalist.yml data/themes/hanuman-chalisa/my-theme.yml
   ```

2. **Edit `generation.style_modifier`** with your style description

3. **Generate images:**
   ```bash
   verse-images --theme-name my-theme
   ```

4. **Add to Jekyll** in `_data/themes.yml`:
   ```yaml
   my-theme:
     name_en: "My Theme"
     name_hi: "मेरी थीम"
     description_en: "Description"
     description_hi: "विवरण"
     folder: "my-theme"
   ```

5. **Test and commit:**
   ```bash
   bundle exec jekyll serve
   git add data/themes/hanuman-chalisa/my-theme.yml images/hanuman-chalisa/my-theme/ _data/themes.yml
   git commit -m "Add my-theme"
   ```

## Iterating on a Theme

```bash
# Review and regenerate specific images
verse-images --theme-name my-theme --regenerate verse-05.png,verse-12.png

# Or regenerate all after major style changes
verse-images --theme-name my-theme --force
```

## Cost

- **Standard**: 44 images × $0.040 = $1.76
- **HD**: 44 images × $0.080 = $3.52

## See Also

- [Theme README](README.md)
- [Scripts README](../../scripts/README.md)
- [Image Prompts](../image-prompts.md)
- [sanatan-verse-sdk](https://github.com/sanatan-learnings/sanatan-verse-sdk)
