#!/usr/bin/env python3
"""
Generate audio pronunciations for Hanuman Chalisa verses using Eleven Labs API.

This script:
1. Reads verse files from _verses/ directory
2. Extracts Devanagari text for pronunciation
3. Uses Eleven Labs API to generate audio in two speeds (full and slow)
4. Saves MP3 files to audio/ directory

Usage:
    python scripts/generate_audio.py [--start-from FILENAME] [--voice-id VOICE_ID]

Environment Variables:
    ELEVENLABS_API_KEY - Your Eleven Labs API key (required)

Output:
    audio/doha_01_full.mp3, audio/doha_01_slow.mp3
    audio/doha_02_full.mp3, audio/doha_02_slow.mp3
    audio/verse_01_full.mp3, audio/verse_01_slow.mp3
    ... (86 files total for 43 verses)
"""

import os
import sys
import time
from pathlib import Path
from typing import Dict, Optional
import argparse
import re

try:
    from elevenlabs import VoiceSettings
    from elevenlabs.client import ElevenLabs
except ImportError:
    print("Error: elevenlabs package not installed")
    print("Install with: pip install elevenlabs")
    sys.exit(1)

try:
    from dotenv import load_dotenv
except ImportError:
    print("Error: python-dotenv package not installed")
    print("Install with: pip install python-dotenv")
    sys.exit(1)

# Load environment variables
load_dotenv()

# Project paths
PROJECT_DIR = Path(__file__).parent.parent
VERSES_DIR = PROJECT_DIR / "_verses"
AUDIO_DIR = PROJECT_DIR / "audio"

# Voice settings
DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"  # Rachel voice (female, clear)
FULL_SPEED_STABILITY = 0.5
FULL_SPEED_SIMILARITY = 0.75
SLOW_SPEED_STABILITY = 0.7
SLOW_SPEED_SIMILARITY = 0.8


class AudioGenerator:
    """Generate audio files using Eleven Labs API."""

    def __init__(self, api_key: str, voice_id: str = DEFAULT_VOICE_ID):
        """
        Initialize the audio generator.

        Args:
            api_key: Eleven Labs API key
            voice_id: Voice ID to use for generation
        """
        # Initialize client
        # The SDK should auto-detect the correct endpoint from the API key
        self.client = ElevenLabs(api_key=api_key)

        if "_residency_eu" in api_key:
            print("✓ Detected EU data residency API key - SDK will use EU endpoint automatically")
        else:
            print("✓ Using global endpoint")

        self.voice_id = voice_id

        # Create audio directory if it doesn't exist
        AUDIO_DIR.mkdir(exist_ok=True)

    def parse_verse_files(self) -> Dict[str, str]:
        """
        Parse all verse files and extract Devanagari text.

        Returns:
            Dictionary mapping filename to Devanagari text
        """
        verses = {}

        verse_files = sorted(VERSES_DIR.glob("*.md"))

        for verse_file in verse_files:
            content = verse_file.read_text(encoding='utf-8')

            # Extract front matter
            parts = content.split('---')
            if len(parts) < 3:
                continue

            front_matter = parts[1]

            # Extract devanagari text
            devanagari_match = re.search(
                r'devanagari:\s*\|\s*(.*?)(?=\n\w+:|---|\Z)',
                front_matter,
                re.DOTALL
            )

            if devanagari_match:
                devanagari = devanagari_match.group(1).strip()

                # Determine base filename (doha_01, verse_01, etc.)
                base_name = verse_file.stem

                verses[base_name] = devanagari

        print(f"✓ Parsed {len(verses)} verses from {VERSES_DIR}")
        return verses

    def generate_audio(
        self,
        text: str,
        output_path: Path,
        speed: str = "full",
        retry_count: int = 3
    ) -> bool:
        """
        Generate audio file using Eleven Labs API.

        Args:
            text: Text to convert to speech
            output_path: Path to save the MP3 file
            speed: "full" or "slow"
            retry_count: Number of retries on failure

        Returns:
            True if successful, False otherwise
        """
        # Adjust voice settings based on speed
        if speed == "slow":
            # Slower, more deliberate pronunciation
            voice_settings = VoiceSettings(
                stability=SLOW_SPEED_STABILITY,
                similarity_boost=SLOW_SPEED_SIMILARITY,
                style=0.0,
                use_speaker_boost=True
            )
            # Add pauses between lines for slow version
            text = text.replace('\n', '... ')
        else:
            # Normal conversational speed
            voice_settings = VoiceSettings(
                stability=FULL_SPEED_STABILITY,
                similarity_boost=FULL_SPEED_SIMILARITY,
                style=0.0,
                use_speaker_boost=True
            )

        for attempt in range(1, retry_count + 1):
            try:
                # Generate audio using text_to_speech API
                audio = self.client.text_to_speech.convert(
                    voice_id=self.voice_id,
                    text=text,
                    model_id="eleven_multilingual_v2",  # Supports Hindi
                    voice_settings=voice_settings
                )

                # Save to file
                with open(output_path, 'wb') as f:
                    for chunk in audio:
                        f.write(chunk)

                return True

            except Exception as e:
                if attempt < retry_count:
                    wait_time = attempt * 5
                    print(f"  Waiting {wait_time} seconds before retry...")
                    time.sleep(wait_time)
                else:
                    print(f"✗ Error generating {output_path.name} (attempt {attempt}/{retry_count}): {e}")
                    return False

        return False

    def generate_all(self, start_from: Optional[str] = None):
        """
        Generate all audio files for all verses.

        Args:
            start_from: Optional filename to resume from (e.g., 'verse_15_full.mp3')
        """
        verses = self.parse_verse_files()

        if not verses:
            print("Error: No verses found in _verses/ directory")
            return

        total_files = len(verses) * 2  # full and slow for each verse
        generated = 0
        skipped = 0
        failed = 0

        # Determine starting point
        should_skip = start_from is not None

        print(f"\n🎙️  Starting audio generation for {len(verses)} verses ({total_files} files total)\n")

        for idx, (base_name, devanagari) in enumerate(verses.items(), 1):
            # Generate both full and slow versions
            for speed in ["full", "slow"]:
                filename = f"{base_name}_{speed}.mp3"
                output_path = AUDIO_DIR / filename

                # Check if we should skip (for resume functionality)
                if should_skip:
                    if filename == start_from:
                        should_skip = False
                        print(f"→ Resuming from {filename}")
                    else:
                        skipped += 1
                        continue

                # Skip if file already exists
                if output_path.exists():
                    print(f"[{generated + failed + skipped + 1}/{total_files}] ⊙ Skipping {filename} (already exists)")
                    skipped += 1
                    continue

                print(f"[{generated + failed + skipped + 1}/{total_files}] → Generating {filename}...")
                print(f"  Text: {devanagari[:50]}...")

                success = self.generate_audio(
                    text=devanagari,
                    output_path=output_path,
                    speed=speed
                )

                if success:
                    file_size = output_path.stat().st_size / 1024  # KB
                    print(f"  ✓ Generated {filename} ({file_size:.1f} KB)")
                    generated += 1
                else:
                    print(f"  ✗ Failed to generate {filename}")
                    failed += 1

                # Rate limiting - wait between requests
                time.sleep(1)

        # Summary
        print(f"\n" + "="*60)
        print(f"✓ Generation complete!")
        print(f"  Generated: {generated}/{total_files}")
        print(f"  Skipped:   {skipped}/{total_files} (already existed)")
        print(f"  Failed:    {failed}/{total_files}")
        print(f"\nAudio files saved to: {AUDIO_DIR}")

        if failed > 0:
            print(f"\n⚠ {failed} files failed to generate. You can regenerate them by deleting and running again.")


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Generate audio pronunciations for Hanuman Chalisa verses"
    )
    parser.add_argument(
        "--start-from",
        help="Resume from specific file (e.g., verse_15_full.mp3)",
        metavar="FILENAME"
    )
    parser.add_argument(
        "--voice-id",
        help=f"Eleven Labs voice ID (default: {DEFAULT_VOICE_ID})",
        default=DEFAULT_VOICE_ID,
        metavar="VOICE_ID"
    )

    args = parser.parse_args()

    # Check for API key
    api_key = os.getenv("ELEVENLABS_API_KEY")
    if not api_key or api_key == "your-api-key-here":
        print("Error: ELEVENLABS_API_KEY not set")
        print("\nSet your API key by either:")
        print("  1. export ELEVENLABS_API_KEY='your-key-here'")
        print("  2. Create .env file with: ELEVENLABS_API_KEY=your-key-here")
        print("\nGet your API key from: https://elevenlabs.io/app/settings/api-keys")
        sys.exit(1)

    # Initialize generator
    generator = AudioGenerator(api_key=api_key, voice_id=args.voice_id)

    # Generate audio files
    generator.generate_all(start_from=args.start_from)


if __name__ == "__main__":
    main()
