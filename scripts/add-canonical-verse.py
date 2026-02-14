#!/usr/bin/env python3
"""
Helper script to add or update canonical verse texts.

Usage:
    python scripts/add-canonical-verse.py sundar-kaand chaupai_09

This will prompt you to enter the verse text interactively.
"""

import sys
import yaml
from pathlib import Path


def add_verse_interactive(collection: str, verse_id: str):
    """Add a verse to the canonical texts file interactively."""

    canonical_dir = Path("data/canonical-texts")
    file_path = canonical_dir / f"{collection}.yml"

    if not file_path.exists():
        print(f"Error: Collection file not found: {file_path}")
        print(f"Available collections:")
        for f in canonical_dir.glob("*.yml"):
            print(f"  - {f.stem}")
        return False

    # Load existing data
    with open(file_path, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)

    # Check if verse already exists
    existing_verse = None
    existing_index = None
    for i, verse in enumerate(data['verses']):
        if verse['verse_id'] == verse_id:
            existing_verse = verse
            existing_index = i
            break

    if existing_verse:
        print(f"\n📝 Verse '{verse_id}' already exists:")
        print(f"Current text:\n{existing_verse['devanagari']}")
        response = input("\nDo you want to update it? (y/n): ")
        if response.lower() != 'y':
            print("Cancelled.")
            return False

    # Get verse text
    print(f"\n✍️  Enter the Devanagari text for {verse_id}")
    print("Enter the first line:")
    line1 = input("> ")
    print("Enter the second line:")
    line2 = input("> ")

    devanagari_text = f"{line1}\n{line2}"

    # Get optional notes
    notes = input("\nOptional notes (press Enter to skip): ")

    # Create or update verse entry
    verse_entry = {
        'verse_id': verse_id,
        'devanagari': devanagari_text,
        'notes': notes if notes else ""
    }

    if existing_index is not None:
        # Update existing
        data['verses'][existing_index] = verse_entry
        action = "updated"
    else:
        # Add new (try to insert in order if possible)
        # For now, just append
        data['verses'].append(verse_entry)
        action = "added"

    # Save back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        yaml.dump(data, f, allow_unicode=True, sort_keys=False, default_flow_style=False)

    print(f"\n✅ Verse {verse_id} {action} successfully in {file_path}")
    print(f"\nVerse content:")
    print(devanagari_text)

    return True


def main():
    if len(sys.argv) < 3:
        print("Usage: python scripts/add-canonical-verse.py <collection> <verse_id>")
        print("\nExample:")
        print("  python scripts/add-canonical-verse.py sundar-kaand chaupai_09")
        sys.exit(1)

    collection = sys.argv[1]
    verse_id = sys.argv[2]

    print(f"Adding verse to {collection}: {verse_id}")
    add_verse_interactive(collection, verse_id)


if __name__ == "__main__":
    main()
