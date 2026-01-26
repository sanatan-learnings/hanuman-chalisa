# Image Generation Scripts

This directory contains scripts for generating verse images using AI image generation APIs.

## ⚡ Quick Start (Simplest Way)

Use the wrapper script for one-command generation:

```bash
# Basic usage
./scripts/generate.sh traditional-art

# With custom style
./scripts/generate.sh watercolor "soft watercolor painting style"
```

**First Time Setup (30 seconds):**
1. Get API key: https://platform.openai.com/api-keys
2. Set it: `export OPENAI_API_KEY='your-key-here'`
3. Run: `./scripts/generate.sh your-theme-name`

Done! The script auto-installs dependencies and generates all 47 images.

**Options:**
```bash
# HD quality (2x cost)
QUALITY=hd ./scripts/generate.sh theme-name

# Custom size
SIZE=1024x1792 ./scripts/generate.sh theme-name

# Resume from specific image
RESUME=verse-15.png ./scripts/generate.sh theme-name
```

---

## Prerequisites

### 1. Python Environment

Python 3.8 or higher is required.

```bash
python --version  # Should be 3.8+
```

### 2. Install Dependencies

```bash
cd scripts/
pip install -r requirements.txt
```

Or install individually:
```bash
pip install openai requests pillow python-dotenv
```

### 3. OpenAI API Key

You need an OpenAI API key to use DALL-E 3.

**Get an API key:**
1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-...`)

**Set the API key:**

Option A - Environment Variable:
```bash
export OPENAI_API_KEY='sk-your-api-key-here'
```

Option B - .env File (recommended):
```bash
# Create .env file in project root
echo "OPENAI_API_KEY=sk-your-api-key-here" > ../.env
```

Option C - Command Line Argument:
```bash
python generate_theme_images.py --api-key sk-your-api-key-here --theme-name my-theme
```

## Usage

### Basic Usage

Generate a new theme with default settings:

```bash
python generate_theme_images.py --theme-name my-theme
```

### With Style Modifier

Add a style description to customize the output:

```bash
python generate_theme_images.py \
  --theme-name traditional-art \
  --style "traditional Indian devotional art style with rich colors, gold leaf accents, and intricate details"
```

### Advanced Options

```bash
python generate_theme_images.py \
  --theme-name watercolor \
  --style "soft watercolor painting style with gentle colors" \
  --quality hd \
  --size 1024x1024
```

### Resume Interrupted Generation

If generation is interrupted, resume from where you left off:

```bash
python generate_theme_images.py \
  --theme-name my-theme \
  --start-from verse-15.png
```

## Command Line Options

| Option | Description | Default |
|--------|-------------|---------|
| `--theme-name` | Theme directory name (required) | - |
| `--style` | Style modifier to append to prompts | "" |
| `--api-key` | OpenAI API key | `$OPENAI_API_KEY` |
| `--start-from` | Resume from specific file | - |
| `--size` | Image size (1024x1024, 1024x1792, 1792x1024) | 1024x1024 |
| `--quality` | Image quality (standard, hd) | standard |
| `--style-type` | DALL-E style (natural, vivid) | natural |

## Cost Estimates

DALL-E 3 pricing (as of January 2026):
- **Standard Quality**: $0.040 per image
- **HD Quality**: $0.080 per image

For all 47 images:
- Standard: 47 × $0.040 = **$1.88**
- HD: 47 × $0.080 = **$3.76**

Check current pricing at: https://openai.com/pricing

## Examples

### 1. Modern Minimalist (Default)

```bash
python generate_theme_images.py \
  --theme-name modern-minimalist \
  --style "modern minimalist artistic silhouette in saffron orange against clean white background with subtle mandala patterns"
```

### 2. Traditional Indian Art

```bash
python generate_theme_images.py \
  --theme-name traditional-art \
  --style "traditional Indian devotional art style inspired by Mughal miniature paintings, rich colors, gold leaf accents, intricate details, sacred atmosphere"
```

### 3. Watercolor Style

```bash
python generate_theme_images.py \
  --theme-name watercolor \
  --style "soft watercolor illustration with gentle colors, flowing brush strokes, dreamy contemplative mood, hand-painted artistic feel"
```

### 4. Pencil Sketch

```bash
python generate_theme_images.py \
  --theme-name pencil-sketch \
  --style "detailed pencil sketch drawing, black and white, classical line art, timeless artistic aesthetic"
```

### 5. Contemporary Digital Art

```bash
python generate_theme_images.py \
  --theme-name digital-art \
  --style "contemporary digital illustration, vibrant colors, dynamic composition, modern graphic novel style with spiritual symbolism"
```

## Configuration Information Required

### Essential Configuration

1. **OpenAI API Key** (required)
   - Get from: https://platform.openai.com/api-keys
   - Set via: environment variable, .env file, or command line

2. **Theme Name** (required)
   - Lowercase with hyphens only
   - Examples: `traditional-art`, `watercolor`, `pencil-sketch`

### Optional Configuration

3. **Style Modifier** (recommended)
   - Description of artistic style
   - Appended to base prompts from docs/image-prompts.md
   - Example: "traditional Indian devotional art style"

4. **Image Quality**
   - `standard`: Faster, cheaper ($0.040/image)
   - `hd`: Higher quality, 2x cost ($0.080/image)

5. **Image Size**
   - `1024x1024`: Square (recommended for thumbnails)
   - `1024x1792`: Portrait
   - `1792x1024`: Landscape

6. **DALL-E Style Type**
   - `natural`: More realistic, toned down
   - `vivid`: More dramatic, hyper-real

## Output

Generated images are saved to:
```
images/{theme-name}/
├── title-page.png
├── opening-doha-01.png
├── opening-doha-02.png
├── verse-01.png
├── verse-02.png
├── ... (verse-03.png through verse-40.png)
└── closing-doha.png
```

## After Generation

### 1. Review Images

```bash
open images/your-theme-name/  # macOS
xdg-open images/your-theme-name/  # Linux
explorer images\your-theme-name\  # Windows
```

### 2. Update Theme Configuration

Edit `_data/themes.yml`:

```yaml
your-theme-name:
  name_en: "Your Theme Name"
  name_hi: "आपकी थीम का नाम"
  description_en: "Description in English"
  description_hi: "हिन्दी में विवरण"
  folder: "your-theme-name"
  default: false
```

### 3. Test Locally

```bash
cd ..
jekyll serve
# Open http://localhost:4000/hanuman-chalisa/
# Test theme switching
```

### 4. Commit and Push

```bash
git add images/your-theme-name/
git add _data/themes.yml
git commit -m "Add [Your Theme Name] image theme"
git push origin main
```

## Troubleshooting

### API Key Not Found

```
Error: OpenAI API key not found!
```

**Solution**: Set the `OPENAI_API_KEY` environment variable or use `--api-key` flag.

### Rate Limit Error

```
Error: Rate limit exceeded
```

**Solution**: Wait a few minutes. The script includes automatic retry with backoff. For free tier, you may need to wait longer between batches.

### Insufficient Credits

```
Error: Insufficient credits
```

**Solution**: Add credits to your OpenAI account at https://platform.openai.com/account/billing

### Generation Interrupted

**Solution**: Resume using `--start-from` flag:
```bash
python generate_theme_images.py \
  --theme-name my-theme \
  --start-from verse-20.png
```

### Image Quality Issues

**Solution**:
- Try `--quality hd` for higher quality (2x cost)
- Refine your `--style` description
- Adjust `--style-type` between `natural` and `vivid`
- Regenerate specific images by deleting them and re-running

## Rate Limits

OpenAI API rate limits (may vary by account tier):
- Free tier: 3 requests per minute
- Paid tier: Higher limits based on usage history

The script includes:
- 2-second delay between requests
- Automatic retry with exponential backoff
- Resume capability for interrupted generation

## Tips for Best Results

1. **Style Consistency**: Use detailed, consistent style descriptions
2. **Test First**: Generate 2-3 images first to verify style before generating all 47
3. **Review Prompts**: Check `docs/image-prompts.md` to understand base prompts
4. **Cultural Sensitivity**: Ensure respectful representation of Hindu deities
5. **Iterate**: Regenerate specific images that don't meet quality standards
6. **HD Quality**: Consider using HD for final production images

## Support

For issues or questions:
- Check [docs/adding-themes.md](../docs/adding-themes.md) for theme guidelines
- Open an issue on GitHub
- Review OpenAI API documentation

## Resources

- [OpenAI API Documentation](https://platform.openai.com/docs/guides/images)
- [DALL-E 3 Guide](https://platform.openai.com/docs/guides/images/usage)
- [Project Theme Documentation](../docs/adding-themes.md)
- [Base Image Prompts](../docs/image-prompts.md)

---

**Last Updated**: January 2026
