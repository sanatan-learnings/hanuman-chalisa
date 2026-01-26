#!/usr/bin/env python3
"""
Generate Hanuman Chalisa verse images using DALL-E 3.

This script reads prompts from docs/image-prompts.md and generates all 47 images
for a new theme using OpenAI's DALL-E 3 API.

Usage:
    python scripts/generate_theme_images.py --theme-name traditional-art --style "traditional Indian devotional art style"

Requirements:
    pip install openai requests pillow
"""

import os
import sys
import re
import time
import argparse
from pathlib import Path
from typing import List, Dict, Optional
import requests
from openai import OpenAI

# Configuration
DOCS_DIR = Path(__file__).parent.parent / "docs"
IMAGES_DIR = Path(__file__).parent.parent / "images"
PROMPTS_FILE = DOCS_DIR / "image-prompts.md"

# DALL-E 3 Configuration
DALLE_MODEL = "dall-e-3"
IMAGE_SIZE = "1024x1024"  # Options: 1024x1024, 1024x1792, 1792x1024
IMAGE_QUALITY = "standard"  # Options: standard, hd
IMAGE_STYLE = "natural"  # Options: natural, vivid


class ImageGenerator:
    """Generate images using DALL-E 3 API."""

    def __init__(self, api_key: str, theme_name: str, style_modifier: str = ""):
        """
        Initialize the image generator.

        Args:
            api_key: OpenAI API key
            theme_name: Name of the theme (e.g., 'traditional-art')
            style_modifier: Additional style description to append to base prompts
        """
        self.client = OpenAI(api_key=api_key)
        self.theme_name = theme_name
        self.style_modifier = style_modifier
        self.output_dir = IMAGES_DIR / theme_name

        # Create output directory
        self.output_dir.mkdir(parents=True, exist_ok=True)
        print(f"✓ Output directory created: {self.output_dir}")

    def parse_prompts_file(self) -> Dict[str, str]:
        """
        Parse the image-prompts.md file to extract all prompts.

        Returns:
            Dictionary mapping filename to prompt text
        """
        if not PROMPTS_FILE.exists():
            raise FileNotFoundError(f"Prompts file not found: {PROMPTS_FILE}")

        with open(PROMPTS_FILE, 'r', encoding='utf-8') as f:
            content = f.read()

        prompts = {}

        # Extract banner/title page prompt
        banner_match = re.search(
            r'### Banner/Title Page.*?\*\*Full Prompt\*\*:\s*```\s*(.*?)\s*```',
            content,
            re.DOTALL
        )
        if banner_match:
            prompts['title-page.png'] = banner_match.group(1).strip()

        # Extract opening doha prompts
        doha_sections = re.findall(
            r'### Opening Doha (\d+):.*?\*\*Base Prompt\*\*:\s*(.*?)(?=\n---|\n###|\Z)',
            content,
            re.DOTALL
        )
        for doha_num, prompt in doha_sections:
            filename = f'opening-doha-{doha_num.zfill(2)}.png'
            prompts[filename] = prompt.strip()

        # Extract verse prompts
        verse_sections = re.findall(
            r'### Verse (\d+):.*?\*\*Base Prompt\*\*:\s*(.*?)(?=\n---|\n###|\Z)',
            content,
            re.DOTALL
        )
        for verse_num, prompt in verse_sections:
            filename = f'verse-{verse_num.zfill(2)}.png'
            prompts[filename] = prompt.strip()

        # Extract closing doha prompt
        closing_match = re.search(
            r'### Closing Doha:.*?\*\*Base Prompt\*\*:\s*(.*?)(?=\n---|\n###|\Z)',
            content,
            re.DOTALL
        )
        if closing_match:
            prompts['closing-doha.png'] = closing_match.group(1).strip()

        print(f"✓ Parsed {len(prompts)} prompts from {PROMPTS_FILE.name}")
        return prompts

    def build_full_prompt(self, base_prompt: str) -> str:
        """
        Build the full prompt by combining base prompt with style modifier.

        Args:
            base_prompt: The base prompt from the documentation

        Returns:
            Complete prompt for DALL-E 3
        """
        if self.style_modifier:
            return f"{base_prompt}\n\nStyle: {self.style_modifier}"
        return base_prompt

    def generate_image(self, filename: str, prompt: str, retry_count: int = 3) -> bool:
        """
        Generate a single image using DALL-E 3.

        Args:
            filename: Output filename (e.g., 'verse-01.png')
            prompt: The prompt for image generation
            retry_count: Number of retries on failure

        Returns:
            True if successful, False otherwise
        """
        output_path = self.output_dir / filename

        # Skip if file already exists
        if output_path.exists():
            print(f"⊙ Skipping {filename} (already exists)")
            return True

        full_prompt = self.build_full_prompt(prompt)

        print(f"\n→ Generating {filename}...")
        print(f"  Prompt: {prompt[:80]}...")

        for attempt in range(retry_count):
            try:
                # Generate image using DALL-E 3
                response = self.client.images.generate(
                    model=DALLE_MODEL,
                    prompt=full_prompt,
                    size=IMAGE_SIZE,
                    quality=IMAGE_QUALITY,
                    style=IMAGE_STYLE,
                    n=1
                )

                # Download the image
                image_url = response.data[0].url
                image_data = requests.get(image_url).content

                # Save the image
                with open(output_path, 'wb') as f:
                    f.write(image_data)

                file_size = len(image_data) / 1024  # KB
                print(f"✓ Generated {filename} ({file_size:.1f} KB)")

                # Rate limiting - DALL-E 3 has rate limits
                time.sleep(2)

                return True

            except Exception as e:
                print(f"✗ Error generating {filename} (attempt {attempt + 1}/{retry_count}): {e}")
                if attempt < retry_count - 1:
                    wait_time = (attempt + 1) * 5
                    print(f"  Waiting {wait_time} seconds before retry...")
                    time.sleep(wait_time)

        return False

    def generate_all_images(self, start_from: Optional[str] = None) -> None:
        """
        Generate all 47 images for the theme.

        Args:
            start_from: Optional filename to start from (useful for resuming)
        """
        prompts = self.parse_prompts_file()

        # Sort prompts in logical order
        ordered_files = ['title-page.png']
        ordered_files += [f'opening-doha-{i:02d}.png' for i in range(1, 3)]
        ordered_files += [f'verse-{i:02d}.png' for i in range(1, 41)]
        ordered_files += ['closing-doha.png']

        # Filter to only include files with prompts
        ordered_files = [f for f in ordered_files if f in prompts]

        # Start from specific file if requested
        if start_from:
            try:
                start_idx = ordered_files.index(start_from)
                ordered_files = ordered_files[start_idx:]
                print(f"✓ Resuming from {start_from}")
            except ValueError:
                print(f"⚠ Warning: {start_from} not found, starting from beginning")

        print(f"\n{'='*60}")
        print(f"Generating {len(ordered_files)} images for theme: {self.theme_name}")
        print(f"Output directory: {self.output_dir}")
        print(f"Style modifier: {self.style_modifier or '(none)'}")
        print(f"{'='*60}\n")

        successful = 0
        failed = []

        for idx, filename in enumerate(ordered_files, 1):
            print(f"\n[{idx}/{len(ordered_files)}] ", end='')

            if self.generate_image(filename, prompts[filename]):
                successful += 1
            else:
                failed.append(filename)

        # Summary
        print(f"\n{'='*60}")
        print(f"Generation complete!")
        print(f"✓ Successful: {successful}/{len(ordered_files)}")
        if failed:
            print(f"✗ Failed: {len(failed)}")
            for f in failed:
                print(f"  - {f}")
        print(f"{'='*60}\n")

        if successful == len(ordered_files):
            print(f"🎉 All images generated successfully!")
            print(f"\nNext steps:")
            print(f"1. Review images in: {self.output_dir}")
            print(f"2. Update _data/themes.yml with your new theme")
            print(f"3. Test the theme on your local Jekyll site")
            print(f"4. Commit and push to GitHub")


def main():
    """Main entry point for the script."""
    parser = argparse.ArgumentParser(
        description='Generate Hanuman Chalisa verse images using DALL-E 3',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Generate modern minimalist theme (default)
  python scripts/generate_theme_images.py --theme-name modern-minimalist

  # Generate traditional art style
  python scripts/generate_theme_images.py \\
    --theme-name traditional-art \\
    --style "traditional Indian devotional art style with rich colors and gold accents"

  # Generate watercolor style
  python scripts/generate_theme_images.py \\
    --theme-name watercolor \\
    --style "soft watercolor painting style with gentle colors and artistic brush strokes"

  # Resume from a specific image
  python scripts/generate_theme_images.py \\
    --theme-name my-theme \\
    --start-from verse-15.png

Configuration:
  Set your OpenAI API key:
    export OPENAI_API_KEY='your-api-key-here'

  Or use .env file (requires python-dotenv):
    OPENAI_API_KEY=your-api-key-here

Cost Estimate:
  - DALL-E 3 Standard: $0.040 per image
  - DALL-E 3 HD: $0.080 per image
  - 47 images × $0.040 = $1.88 (standard quality)
  - 47 images × $0.080 = $3.76 (HD quality)
        """
    )

    parser.add_argument(
        '--theme-name',
        required=True,
        help='Name of the theme (e.g., traditional-art, watercolor)'
    )

    parser.add_argument(
        '--style',
        default='',
        help='Style modifier to append to base prompts'
    )

    parser.add_argument(
        '--api-key',
        default=None,
        help='OpenAI API key (or set OPENAI_API_KEY environment variable)'
    )

    parser.add_argument(
        '--start-from',
        default=None,
        help='Filename to start from (useful for resuming, e.g., verse-15.png)'
    )

    parser.add_argument(
        '--size',
        choices=['1024x1024', '1024x1792', '1792x1024'],
        default='1024x1024',
        help='Image size (default: 1024x1024)'
    )

    parser.add_argument(
        '--quality',
        choices=['standard', 'hd'],
        default='standard',
        help='Image quality (default: standard, hd costs 2x)'
    )

    parser.add_argument(
        '--style-type',
        choices=['natural', 'vivid'],
        default='natural',
        help='DALL-E style type (default: natural)'
    )

    args = parser.parse_args()

    # Get API key
    api_key = args.api_key or os.environ.get('OPENAI_API_KEY')
    if not api_key:
        print("Error: OpenAI API key not found!")
        print("\nPlease provide API key via:")
        print("  1. --api-key argument")
        print("  2. OPENAI_API_KEY environment variable")
        print("\nExample:")
        print("  export OPENAI_API_KEY='your-api-key-here'")
        print("  python scripts/generate_theme_images.py --theme-name my-theme")
        sys.exit(1)

    # Update global configuration
    global IMAGE_SIZE, IMAGE_QUALITY, IMAGE_STYLE
    IMAGE_SIZE = args.size
    IMAGE_QUALITY = args.quality
    IMAGE_STYLE = args.style_type

    # Validate theme name
    if not re.match(r'^[a-z0-9-]+$', args.theme_name):
        print("Error: Theme name must contain only lowercase letters, numbers, and hyphens")
        sys.exit(1)

    # Create generator and run
    try:
        generator = ImageGenerator(api_key, args.theme_name, args.style)
        generator.generate_all_images(start_from=args.start_from)
    except KeyboardInterrupt:
        print("\n\n⚠ Generation interrupted by user")
        print("You can resume by running the script with --start-from flag")
        sys.exit(1)
    except Exception as e:
        print(f"\n✗ Fatal error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
