#!/usr/bin/env python3
"""
Convert scene descriptions from Markdown to YAML format.
Moves docs/image-prompts/*.md → data/scenes/*.yml
"""

import re
import yaml
from pathlib import Path


def parse_markdown_scenes(md_content: str) -> dict:
    """Parse Markdown scene descriptions into structured data."""
    scenes = {}

    # Match patterns like:
    # ### Verse 1 (verse_01): Title
    # ### Chaupai 1 (chaupai-01): Title
    # ### Opening Doha 1: Title
    # ### Title Page

    # Split by ### headers
    sections = re.split(r'\n### ', md_content)

    for section in sections[1:]:  # Skip first empty section
        lines = section.strip().split('\n')
        if not lines:
            continue

        header = lines[0]

        # Try to extract verse ID and title
        # Pattern 1: "Verse 1 (verse_01): Title"
        match = re.match(r'(?:Verse|Chaupai|Pada|Shloka|Doha)\s+\d+\s+\(([^)]+)\):\s*(.+)', header)
        if match:
            verse_id = match.group(1).strip()
            title = match.group(2).strip()
        # Pattern 2: "Opening Doha 1: Title" or "Closing Doha: Title"
        elif re.match(r'(Opening|Closing)\s+(Doha|Shloka)\s+\d*:?\s*(.+)', header):
            match = re.match(r'(Opening|Closing)\s+(Doha|Shloka)\s*(\d*):\s*(.+)', header)
            prefix = match.group(1).lower()
            verse_type = match.group(2).lower()
            num = match.group(3)
            title = match.group(4).strip()

            if num:
                verse_id = f"{prefix}-{verse_type}-{num.zfill(2)}"
            else:
                verse_id = f"{prefix}-{verse_type}"
        # Pattern 3: "Title Page"
        elif header == "Title Page":
            verse_id = "title-page"
            title = "Title Page"
        else:
            # Skip non-verse sections (like ## Scene Descriptions, ## Architecture, etc.)
            continue

        # Find scene description
        scene_desc = None
        for i, line in enumerate(lines[1:], 1):
            if line.startswith('**Scene Description**:'):
                # Get everything after this line until next section or end
                desc_lines = []
                for desc_line in lines[i+1:]:
                    if desc_line.startswith('---') or desc_line.startswith('**File**:'):
                        break
                    desc_lines.append(desc_line)
                scene_desc = '\n'.join(desc_lines).strip()
                break

        if scene_desc:
            scenes[verse_id] = {
                'title': title,
                'description': scene_desc
            }

    return scenes


def convert_collection(collection_name: str):
    """Convert one collection's scene descriptions."""
    md_file = Path(f"docs/image-prompts/{collection_name}.md")
    yaml_file = Path(f"data/scenes/{collection_name}.yml")

    if not md_file.exists():
        print(f"⚠️  Skipping {collection_name}: {md_file} not found")
        return

    print(f"Converting {collection_name}...")

    # Read Markdown
    md_content = md_file.read_text()

    # Parse to structured data
    scenes = parse_markdown_scenes(md_content)

    if not scenes:
        print(f"  ⚠️  No scenes found in {md_file}")
        return

    # Create YAML with metadata
    yaml_data = {
        '_meta': {
            'collection': collection_name,
            'source': f'Converted from docs/image-prompts/{collection_name}.md',
            'description': f'Scene descriptions for {collection_name} image generation',
            'format': 'theme-agnostic scene descriptions (narrative and spiritual meaning)',
        },
        'scenes': scenes
    }

    # Write YAML
    yaml_file.parent.mkdir(parents=True, exist_ok=True)
    with open(yaml_file, 'w') as f:
        yaml.dump(yaml_data, f,
                 default_flow_style=False,
                 allow_unicode=True,
                 sort_keys=False,
                 width=100)

    print(f"  ✓ Created {yaml_file}")
    print(f"  ✓ Converted {len(scenes)} scenes")


def main():
    """Convert all collections."""
    collections = [
        'hanuman-chalisa',
        'sundar-kaand',
        'sankat-mochan-hanumanashtak'
    ]

    print("Converting scene descriptions from Markdown to YAML...")
    print()

    for collection in collections:
        convert_collection(collection)
        print()

    print("✓ Conversion complete!")
    print()
    print("Next steps:")
    print("  1. Review generated files in data/scenes/")
    print("  2. Update SDK to read from data/scenes/*.yml")
    print("  3. Test image generation")
    print("  4. Archive old docs/image-prompts/ (don't delete yet)")


if __name__ == '__main__':
    main()
