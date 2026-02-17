# Hanuman GPT: AI Spiritual Guide

🚩 **Jai Hanuman 🏹 Jai Shri Ram**

**🌐 [View the live interactive website →](https://sanatan-learnings.github.io/hanuman-gpt/)**

_May Lord Hanuman's blessings be with all who study and recite these sacred verses._

---

## About

A detailed, verse-by-verse exploration of sacred Hindu texts related to Lord Hanuman.

**Currently featured:**
- **Hanuman Chalisa** ✅ Complete - 43 verses by Goswami Tulsidas glorifying Lord Hanuman
- **Sankat Mochan Hanumanashtak** ✅ Complete - 8 verses for removing obstacles
- **Sundar Kaand** 🚧 In Progress - 25 verses from Ramcharitmanas describing Hanuman's journey to Lanka

**Coming soon:**
- Hanuman Stuti - Devotional hymns
- Hanuman Kavacham - Protective armor of Hanuman
- Hanuman Bahuk - Additional sacred verses

This guide provides deep understanding of each verse with translations, meanings, stories from the Ramayana, and practical applications for modern life - all available in **English** and **हिन्दी (Hindi)**.

## Features

### 📖 Read & Study
- **3 Collections** - Hanuman Chalisa (43 verses, complete), Sankat Mochan Hanumanashtak (8 verses, complete), Sundar Kaand (25 verses, in progress)
- **Original Devanagari text** and transliteration
- **Word-by-word meanings** and literal translations
- **Interpretive meanings** explaining spiritual depth
- **Stories from Ramayana and Puranic texts** providing context
- **Search functionality** across all collections
- **Bilingual support** - Switch between English and Hindi instantly
- **Beautiful AI-generated images** for each verse

### 🎵 Audio Pronunciation (Hanuman Chalisa)
- **86 audio files** - Every Chalisa verse in two speeds (full and slow)
- **Full speed** - Natural recitation pace for experienced practitioners
- **Slow speed** - 25% slower for learning pronunciation
- **AI-generated** - Clear, natural Hindi/Sanskrit pronunciation via Eleven Labs
- **Embedded players** - Listen directly on each verse page
- Perfect for learning correct pronunciation and recitation practice

### 💬 Spiritual Guidance (AI-Powered)
- **Ask questions** and receive spiritual guidance based on relevant verses
- **Multi-collection RAG system** - Searches across all collections
- **GPT-4 powered** - Thoughtful, context-aware responses
- **Bilingual** - Works in English and Hindi
- **Conversation history** - Maintains context for follow-up questions

[Try Spiritual Guidance →](https://sanatan-learnings.github.io/hanuman-gpt/guidance)

### 📕 Generate Custom Books (Hanuman Chalisa)
Create personalized printable books for Hanuman Chalisa:
- **Multiple sizes**: 6"×4" pocket, 8"×6" medium, A5, A4
- **Customizable content**: Choose what to include
- **Custom headers/footers**: Personalize with your own text
- **Print or PDF**: Ready for home or professional printing

[Visit Book Generator →](https://sanatan-learnings.github.io/hanuman-gpt/chalisa/book)

### 🎨 Multiple Themes
- Switch between different artistic styles
- Current: Modern Minimalist theme
- Generate your own themes using DALL-E 3 (see below)

## For Developers

Want to contribute or generate custom themes?

**→ See the [Documentation](docs/README.md)** for:
- Local development setup
- Generating custom image themes with DALL-E 3 (~$1.72 for 43 images)
- Generating audio files with Eleven Labs (~$0.0002 for 86 files)
- **Regenerating embeddings** for the RAG system (FREE, runs locally)
- Project structure and architecture
- Testing and deployment

**→ See [CONTRIBUTING.md](CONTRIBUTING.md)** for contribution guidelines

### Quick Start: Generate Verse Content

```bash
# Install sanatan-verse-sdk 0.27.0+
pip install sanatan-verse-sdk

# Auto-detect and generate next verse (image + audio + embeddings)
verse-generate \
  --collection sundar-kaand \
  --next \
  --regenerate-content \
  --auto-generate-scene
```

**What it generates:**
- Verse: `_verses/sundar-kaand/chaupai-20.md` (AI-generated content from canonical YAML)
- Image: `images/sundar-kaand/modern-minimalist/chaupai-20.png`
- Audio: `audio/sundar-kaand/chaupai-20-full.mp3` + `chaupai-20-slow.mp3`
- Scene: `data/scenes/sundar-kaand.yml` (auto-generated if needed)
- Embeddings: Updated automatically

**Cost:** ~$0.05-0.06 per verse (DALL-E 3 + ElevenLabs + AI content generation)

**Bulk regenerate embeddings** (only if you've manually edited multiple verses):
```bash
verse-embeddings --multi-collection \
  --collections-file _data/collections.yml \
  --verses-dir _verses \
  --output data/embeddings.json
```

## Documentation

**User Guides:**
- [User Guide](docs/user-guide.md) - How to use the website
- [Background](docs/background.md) - History of the Hanuman Chalisa
- [Book Generation](docs/book-generation.md) - Create printable books

**Technical Docs:**
- [Developer Guide](docs/developer-guide.md) - Setup, architecture, and development
- [Verse Structure](docs/verse-structure.md) - How verses are organized
- [Tech Stack](docs/tech-stack.md) - Technologies used
- [Adding Themes](docs/adding-themes.md) - Create new image themes
- [Image Prompts](docs/image-prompts.md) - DALL-E 3 prompts used

## Contributing

We welcome contributions! Whether it's:
- Translation improvements
- Additional languages (Tamil, Telugu, Spanish planned)
- New image themes
- Bug fixes or features

See [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

**Upcoming Features:** Check [GitHub Issues](https://github.com/sanatan-learnings/hanuman-gpt/issues)

## Acknowledgments

### Content Creation
- **DALL-E 3** (OpenAI) - AI-generated verse images
- **Eleven Labs** - AI text-to-speech for audio recitations (eleven_multilingual_v2)
- **ffmpeg** - Audio post-processing for speed control
- **GPT-4** (OpenAI) - Spiritual guidance generation
- **sentence-transformers** (Hugging Face) - Local embeddings for semantic search
- **Claude Code** (Anthropic) - AI-assisted content generation and development
- **Human review** - All content validated for accuracy and devotional authenticity

### Traditional Sources
Content draws upon:
- **Sundar Kaand**: [Hindi Wikipedia - Sundar Kaand](https://hi.wikipedia.org/wiki/%E0%A4%B8%E0%A5%81%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A4%B0%E0%A4%95%E0%A4%BE%E0%A4%A3%E0%A5%8D%E0%A4%A1)
- Tulsidas's Shri Ramcharitmanas
- Traditional commentaries by various acharyas
- Living oral traditions of Hanuman Chalisa recitation

### Technology
Built with Jekyll, GitHub Pages, DALL-E 3, ElevenLabs, GPT-4, and sanatan-verse-sdk.

→ See [Tech Stack](docs/reference/tech-stack.md) for complete architecture and technology details

## License

Created for educational, devotional, and non-commercial purposes.
May it serve the spiritual upliftment of all beings.

---

🚩 **Jai Hanuman 🏹 Jai Shri Ram**

