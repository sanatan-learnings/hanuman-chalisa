#!/usr/bin/env python3
"""
Generate embeddings for Hanuman Chalisa verses.

This script reads all verse markdown files, extracts YAML front matter,
combines fields into rich semantic documents, and generates embeddings
using either OpenAI or HuggingFace (local via sentence-transformers).

Usage:
    python generate_embeddings.py --provider openai     # Use OpenAI API
    python generate_embeddings.py --provider huggingface # Use HuggingFace (local)
    python generate_embeddings.py                       # Default: use .env EMBEDDING_PROVIDER or 'local'
"""

import os
import sys
import json
import time
import argparse
from pathlib import Path
from datetime import datetime
import yaml
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
VERSES_DIR = Path(__file__).parent.parent / "_verses"
OUTPUT_FILE = Path(__file__).parent.parent / "data" / "embeddings.json"

# Provider configurations
PROVIDERS = {
    'openai': {
        'model': 'text-embedding-3-small',
        'dimensions': 1536,
        'cost_per_1m': 0.02,
        'requires_api_key': True
    },
    'huggingface': {
        'model': 'sentence-transformers/all-MiniLM-L6-v2',
        'dimensions': 384,
        'cost_per_1m': 0.0,  # Free (local)
        'requires_api_key': False
    }
}


def get_openai_embedding(text, client, model):
    """Get embedding from OpenAI API."""
    try:
        response = client.embeddings.create(
            model=model,
            input=text
        )
        return response.data[0].embedding
    except Exception as e:
        print(f"  Error: {e}")
        return None


def get_huggingface_embedding(text, model_instance):
    """Get embedding from local HuggingFace model."""
    try:
        # The model returns a list of embeddings (one per input)
        embedding = model_instance.encode([text])[0].tolist()
        return embedding
    except Exception as e:
        print(f"  Error: {e}")
        return None


def initialize_provider(provider_name):
    """
    Initialize the embedding provider.

    Returns:
        tuple: (embedding_function, client_or_model, config)
    """
    config = PROVIDERS[provider_name]

    if provider_name == 'openai':
        from openai import OpenAI

        api_key = os.getenv('OPENAI_API_KEY', '')
        if not api_key:
            print("Error: OPENAI_API_KEY not found in .env file")
            sys.exit(1)

        client = OpenAI(api_key=api_key)
        print(f"✓ OpenAI client initialized (key: {api_key[:8]}...)")

        return get_openai_embedding, client, config

    elif provider_name == 'huggingface':
        try:
            from sentence_transformers import SentenceTransformer
        except ImportError:
            print("Error: sentence-transformers not installed")
            print("Run: ./venv/bin/pip install sentence-transformers")
            sys.exit(1)

        print(f"Loading model {config['model']}...")
        model = SentenceTransformer(config['model'])
        print(f"✓ Model loaded successfully")

        return get_huggingface_embedding, model, config

    else:
        print(f"Error: Unknown provider '{provider_name}'")
        print(f"Available providers: {', '.join(PROVIDERS.keys())}")
        sys.exit(1)


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
    lit_key = 'literal_translation'
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
        if 'Opening' in title_en or verse_num == 1 or verse_num == '1':
            return '/verses/doha_01/'
        elif verse_num == 2 or verse_num == '2':
            return '/verses/doha_02/'
    elif 'Closing' in title_en:
        return '/verses/doha_closing/'

    # Ensure verse_num is an integer for formatting
    if isinstance(verse_num, str):
        try:
            verse_num = int(verse_num)
        except ValueError:
            verse_num = 0

    return f'/verses/verse_{verse_num:02d}/'


def process_verse_file(file_path, embed_func, client_or_model, config):
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

    # Get embeddings
    print(f"  Getting English embedding...")
    if config['requires_api_key']:
        emb_en = embed_func(doc_en, client_or_model, config['model'])
    else:
        emb_en = embed_func(doc_en, client_or_model)

    # Small delay for API rate limiting (only if using API)
    if config['requires_api_key']:
        time.sleep(0.1)

    print(f"  Getting Hindi embedding...")
    if config['requires_api_key']:
        emb_hi = embed_func(doc_hi, client_or_model, config['model'])
    else:
        emb_hi = embed_func(doc_hi, client_or_model)

    # Small delay for API rate limiting (only if using API)
    if config['requires_api_key']:
        time.sleep(0.1)

    if not emb_en or not emb_hi:
        print(f"  Warning: Failed to get embeddings for {file_path.name}")
        return None

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
    # Parse command-line arguments
    parser = argparse.ArgumentParser(
        description='Generate embeddings for Hanuman Chalisa verses',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python generate_embeddings.py --provider openai       # Use OpenAI API
  python generate_embeddings.py --provider huggingface  # Use local HuggingFace model
  python generate_embeddings.py                        # Use default from .env
        """
    )
    parser.add_argument(
        '--provider',
        choices=['openai', 'huggingface'],
        default=os.getenv('EMBEDDING_PROVIDER', 'huggingface'),
        help='Embedding provider to use (default: from EMBEDDING_PROVIDER env var or "huggingface")'
    )

    args = parser.parse_args()
    provider_name = args.provider

    print("=" * 70)
    print("Hanuman Chalisa Embeddings Generator")
    print("=" * 70)

    # Initialize provider
    embed_func, client_or_model, config = initialize_provider(provider_name)

    print(f"Provider: {provider_name}")
    print(f"Model: {config['model']}")
    print(f"Dimensions: {config['dimensions']}")
    print(f"Verses directory: {VERSES_DIR}")
    print(f"Output file: {OUTPUT_FILE}")
    print()

    # Check verses directory
    if not VERSES_DIR.exists():
        print(f"Error: Verses directory not found: {VERSES_DIR}")
        sys.exit(1)

    # Find all verse files
    verse_files = sorted(VERSES_DIR.glob("*.md"))
    print(f"Found {len(verse_files)} verse files")
    print()

    # Process all verses
    verses_en = []
    verses_hi = []

    for verse_file in verse_files:
        result = process_verse_file(verse_file, embed_func, client_or_model, config)
        if result:
            verses_en.append(result['en'])
            verses_hi.append(result['hi'])
        print()

    # Sort by verse number
    verses_en.sort(key=lambda v: int(v['verse_number']) if isinstance(v['verse_number'], (int, str)) and str(v['verse_number']).isdigit() else 999)
    verses_hi.sort(key=lambda v: int(v['verse_number']) if isinstance(v['verse_number'], (int, str)) and str(v['verse_number']).isdigit() else 999)

    # Build output structure
    output = {
        'model': config['model'],
        'dimensions': config['dimensions'],
        'provider': provider_name,
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
    print("=" * 70)
    print("Generation Complete!")
    print("=" * 70)
    print(f"Total verses processed: {len(verses_en)}")
    print(f"English embeddings: {len(verses_en)}")
    print(f"Hindi embeddings: {len(verses_hi)}")
    print(f"Output file size: {OUTPUT_FILE.stat().st_size / 1024:.1f} KB")

    # Calculate approximate cost
    total_embeddings = len(verses_en) + len(verses_hi)
    if config['cost_per_1m'] > 0:
        approx_tokens = total_embeddings * 750  # Rough estimate
        cost = (approx_tokens / 1_000_000) * config['cost_per_1m']
        print(f"Approximate cost: ${cost:.4f} ({config['model']} @ ${config['cost_per_1m']}/1M tokens)")
    else:
        print(f"Cost: FREE (local model)")
    print()


if __name__ == '__main__':
    main()
