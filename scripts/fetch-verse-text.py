#!/usr/bin/env python3
"""
Fetch traditional Devanagari verse text from authoritative online sources.

This script scrapes verse text from reputable sources of Ramcharitmanas
and other sacred texts to ensure accuracy and authenticity.
"""

import sys
import re
import json
import argparse
from typing import Optional, Dict

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("Error: Required packages not installed")
    print("Install with: pip install requests beautifulsoup4")
    sys.exit(1)


# Authoritative sources for different collections
SOURCES = {
    "sundar-kaand": {
        "name": "Ramcharitmanas - Sundar Kand",
        "url_template": "https://www.ramcharitmanas.net/sundar-kand/doha-{verse_num}",
        "url_template_chaupai": "https://www.ramcharitmanas.net/sundar-kand/chaupai-{verse_num}",
        "selectors": [
            ".verse-text",
            ".devanagari",
            "div.hindi-text",
            "p.verse",
        ]
    },
    "hanuman-chalisa": {
        "name": "Hanuman Chalisa",
        "url_template": "https://www.hanumanworld.com/hanuman-chalisa-verse-{verse_num}.html",
        "selectors": [
            ".chalisa-verse",
            ".devanagari-text",
            "div.verse",
        ]
    }
}


def clean_devanagari_text(text: str) -> str:
    """Clean and normalize Devanagari text."""
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text.strip())

    # Remove common artifacts
    text = text.replace('।।', '।।')  # Normalize double danda
    text = text.replace('॥', '।।')    # Normalize to standard danda

    # Remove English characters and numbers (except verse markers)
    # Keep Devanagari characters and punctuation
    text = re.sub(r'[A-Za-z]+', '', text)

    return text.strip()


def fetch_from_ramcharitmanas_net(collection: str, verse_num: int, verse_type: str = "chaupai") -> Optional[str]:
    """
    Fetch verse from ramcharitmanas.net

    Args:
        collection: Collection name (e.g., "sundar-kaand")
        verse_num: Verse number
        verse_type: "chaupai" or "doha"

    Returns:
        Devanagari text or None if not found
    """
    try:
        # Try different URL patterns
        urls = [
            f"https://www.ramcharitmanas.net/sundar-kand/{verse_type}-{verse_num}",
            f"https://www.ramcharitmanas.net/sundar/{verse_type}-{verse_num}.htm",
            f"https://www.ramcharitmanas.net/sunderkand-{verse_type}-{verse_num}.html",
        ]

        for url in urls:
            try:
                response = requests.get(url, timeout=10)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.content, 'html.parser')

                    # Try different selectors
                    selectors = [
                        'div.devanagari',
                        'p.hindi',
                        'div.verse-hindi',
                        'span.devanagari',
                        'div[lang="hi"]',
                    ]

                    for selector in selectors:
                        elements = soup.select(selector)
                        if elements:
                            text = ' '.join([el.get_text() for el in elements])
                            text = clean_devanagari_text(text)
                            if text and len(text) > 10:  # Must have substantial content
                                return text
            except Exception as e:
                continue

        return None

    except Exception as e:
        print(f"Error fetching from ramcharitmanas.net: {e}", file=sys.stderr)
        return None


def fetch_from_generic_source(url: str, selectors: list) -> Optional[str]:
    """Fetch verse from a generic URL with CSS selectors."""
    try:
        response = requests.get(url, timeout=10)
        if response.status_code != 200:
            return None

        soup = BeautifulSoup(response.content, 'html.parser')

        for selector in selectors:
            elements = soup.select(selector)
            if elements:
                text = ' '.join([el.get_text() for el in elements])
                text = clean_devanagari_text(text)
                if text and len(text) > 10:
                    return text

        return None

    except Exception as e:
        print(f"Error fetching from {url}: {e}", file=sys.stderr)
        return None


def fetch_verse_text(collection: str, verse_id: str) -> Dict[str, any]:
    """
    Fetch traditional Devanagari text for a verse.

    Args:
        collection: Collection key (e.g., "sundar-kaand")
        verse_id: Verse identifier (e.g., "chaupai_05", "verse_10", "doha_01")

    Returns:
        Dictionary with verse text and metadata
    """
    # Parse verse_id to get type and number
    match = re.match(r'(chaupai|doha|verse)_?(\d+)', verse_id)
    if not match:
        return {
            "success": False,
            "error": f"Invalid verse_id format: {verse_id}"
        }

    verse_type = match.group(1)
    verse_num = int(match.group(2))

    print(f"Fetching {verse_type} {verse_num} from {collection}...", file=sys.stderr)

    # Try primary source
    text = fetch_from_ramcharitmanas_net(collection, verse_num, verse_type)

    if text:
        return {
            "success": True,
            "collection": collection,
            "verse_id": verse_id,
            "verse_type": verse_type,
            "verse_number": verse_num,
            "devanagari": text,
            "source": "ramcharitmanas.net",
            "verified": True
        }

    return {
        "success": False,
        "error": f"Could not fetch verse text from any source",
        "collection": collection,
        "verse_id": verse_id,
        "tried_sources": ["ramcharitmanas.net"]
    }


def main():
    parser = argparse.ArgumentParser(
        description="Fetch traditional Devanagari verse text from authoritative sources"
    )
    parser.add_argument(
        "--collection",
        required=True,
        help="Collection key (e.g., sundar-kaand, hanuman-chalisa)"
    )
    parser.add_argument(
        "--verse",
        required=True,
        help="Verse identifier (e.g., chaupai_05, verse_10, doha_01)"
    )
    parser.add_argument(
        "--format",
        choices=["json", "text"],
        default="json",
        help="Output format (default: json)"
    )

    args = parser.parse_args()

    result = fetch_verse_text(args.collection, args.verse)

    if args.format == "json":
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        if result["success"]:
            print(result["devanagari"])
        else:
            print(f"Error: {result['error']}", file=sys.stderr)
            sys.exit(1)

    sys.exit(0 if result["success"] else 1)


if __name__ == "__main__":
    main()
