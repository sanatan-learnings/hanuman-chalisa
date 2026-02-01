#!/usr/bin/env python3
"""
Generate embeddings for Hanuman Chalisa verses using local models.

This script reads all verse markdown files, extracts YAML front matter,
combines fields into rich semantic documents, generates embeddings locally
using sentence-transformers (no API calls needed), and outputs embeddings.json.

Installation:
  pip install sentence-transformers

Usage:
  python scripts/generate_embeddings_local.py
"""

import os
import sys
import json
from pathlib import Path
from datetime import datetime
import yaml

try:
    from sentence_transformers import SentenceTransformer
except ImportError:
    print("Error: sentence-transformers not installed")
    print("Please install it with: pip install sentence-transformers")
    sys.exit(1)

# Configuration
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
EMBEDDING_DIMENSIONS = 384
VERSES_DIR = Path(__file__).parent.parent / "_verses"
OUTPUT_FILE = Path(__file__).parent.parent / "data" / "embeddings.json"

def extract_yaml_frontmatter(file_path):
    """Extract YAML front matter from markdown file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if not content.startswith('---'):
        return None

    end_idx = content.find('---', 3)
    if end_idx == -1:
        return None

    yaml_content = content[3:end_idx].strip()
    return yaml.safe_load(yaml_content)

def build_document(verse_data, lang='en'):
    """
    Build a rich semantic document from verse data.

    Combines multiple fields to capture full spiritual context:
    - Title (semantic anchor)
    - Transliteration (Sanskrit/Hindi terminology)
    - Literal Translation (basic meaning)
    - Interpretive Meaning (spiritual depth)
    - Story (mythological context)
    - Practical Application (teaching + when to use)
    """
    parts = []

    # Title
    title_key = f'title_{lang}'
    if title_key in verse_data:
        parts.append(verse_data[title_key])

    # Transliteration (same for both languages)
    if 'transliteration' in verse_data:
        parts.append(f"Transliteration: {verse_data['transliteration']}")

    # Literal Translation
    lit_key = f'literal_translation'
    if lit_key in verse_data:
        lit_data = verse_data[lit_key]
        if isinstance(lit_data, dict) and lang in lit_data:
            parts.append(f"Translation: {lit_data[lang]}")

    # Interpretive Meaning
    meaning_key = 'interpretive_meaning'
    if meaning_key in verse_data:
        meaning_data = verse_data[meaning_key]
        if isinstance(meaning_data, dict) and lang in meaning_data:
            parts.append(f"Meaning: {meaning_data[lang]}")

    # Story
    if 'story' in verse_data:
        story_data = verse_data['story']
        if isinstance(story_data, dict) and lang in story_data:
            parts.append(f"Story: {story_data[lang]}")

    # Practical Application
    if 'practical_application' in verse_data:
        app_data = verse_data['practical_application']

        # Teaching
        if 'teaching' in app_data:
            teaching = app_data['teaching']
            if isinstance(teaching, dict) and lang in teaching:
                parts.append(f"Teaching: {teaching[lang]}")

        # When to use
        if 'when_to_use' in app_data:
            when = app_data['when_to_use']
            if isinstance(when, dict) and lang in when:
                parts.append(f"When to Use: {when[lang]}")

    return "\n\n".join(parts)

def generate_verse_url(verse_data):
    """Generate URL path for verse page."""
    verse_num = verse_data.get('verse_number', 0)

    # Handle special cases (dohas, closing verses)
    title_en = verse_data.get('title_en', '')
    if 'Doha' in title_en:
        if 'Opening' in title_en:
            return '/verses/doha_01/'
        else:
            return '/verses/doha_02/'
    elif 'Closing' in title_en:
        return '/verses/closing_verse/'
    else:
        return f'/verses/verse_{verse_num:02d}/'

def process_verse_file(file_path, model):
    """Process a single verse file and return metadata + embeddings."""
    print(f"Processing {file_path.name}...")

    verse_data = extract_yaml_frontmatter(file_path)
    if not verse_data:
        print(f"  Warning: Could not extract YAML from {file_path.name}")
        return None

    verse_num = verse_data.get('verse_number', 0)

    # Build documents for both languages
    doc_en = build_document(verse_data, 'en')
    doc_hi = build_document(verse_data, 'hi')

    # Get embeddings (locally, no API calls)
    print(f"  Generating embeddings...")
    emb_en = model.encode(doc_en).tolist()
    emb_hi = model.encode(doc_hi).tolist()

    # Prepare result structure
    result = {
        'en': {
            'verse_number': verse_num,
            'title': verse_data.get('title_en', ''),
            'url': generate_verse_url(verse_data),
            'embedding': emb_en,
            'metadata': {
                'devanagari': verse_data.get('devanagari', ''),
                'transliteration': verse_data.get('transliteration', ''),
                'literal_translation': verse_data.get('literal_translation', {}).get('en', '')
            }
        },
        'hi': {
            'verse_number': verse_num,
            'title': verse_data.get('title_hi', ''),
            'url': generate_verse_url(verse_data),
            'embedding': emb_hi,
            'metadata': {
                'devanagari': verse_data.get('devanagari', ''),
                'transliteration': verse_data.get('transliteration', ''),
                'literal_translation': verse_data.get('literal_translation', {}).get('hi', '')
            }
        }
    }

    return result

def main():
    """Main execution flow."""
    print("=" * 60)
    print("Hanuman Chalisa Embeddings Generator (Local)")
    print("=" * 60)
    print(f"Model: {EMBEDDING_MODEL}")
    print(f"Dimensions: {EMBEDDING_DIMENSIONS}")
    print(f"Method: Local (sentence-transformers)")
    print(f"Verses directory: {VERSES_DIR}")
    print(f"Output file: {OUTPUT_FILE}")
    print()

    # Check verses directory
    if not VERSES_DIR.exists():
        print(f"Error: Verses directory not found: {VERSES_DIR}")
        sys.exit(1)

    # Load model
    print("Loading embedding model (this may take a moment on first run)...")
    model = SentenceTransformer(EMBEDDING_MODEL)
    print("Model loaded successfully!")
    print()

    # Find all verse files
    verse_files = sorted(VERSES_DIR.glob("*.md"))
    print(f"Found {len(verse_files)} verse files")
    print()

    # Process all verses
    verses_en = []
    verses_hi = []

    for verse_file in verse_files:
        result = process_verse_file(verse_file, model)
        if result:
            verses_en.append(result['en'])
            verses_hi.append(result['hi'])
        print()

    # Sort by verse number (convert to int for proper sorting)
    verses_en.sort(key=lambda v: int(v['verse_number']) if isinstance(v['verse_number'], (int, str)) and str(v['verse_number']).isdigit() else 999)
    verses_hi.sort(key=lambda v: int(v['verse_number']) if isinstance(v['verse_number'], (int, str)) and str(v['verse_number']).isdigit() else 999)

    # Build output structure
    output = {
        'model': EMBEDDING_MODEL,
        'dimensions': EMBEDDING_DIMENSIONS,
        'provider': 'local',
        'generated_at': datetime.now().isoformat(),
        'verses': {
            'en': verses_en,
            'hi': verses_hi
        }
    }

    # Write to file
    print(f"Writing embeddings to {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print()
    print("=" * 60)
    print("Generation Complete!")
    print("=" * 60)
    print(f"Total verses processed: {len(verses_en)}")
    print(f"English embeddings: {len(verses_en)}")
    print(f"Hindi embeddings: {len(verses_hi)}")
    print(f"Output file size: {OUTPUT_FILE.stat().st_size / 1024:.1f} KB")
    print(f"Cost: FREE (generated locally)")
    print()

if __name__ == '__main__':
    main()
