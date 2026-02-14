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
- **Sundar Kaand** 🚧 In Progress - 6 verses from Ramcharitmanas describing Hanuman's journey to Lanka

**Coming soon:**
- Hanuman Stuti - Devotional hymns
- Hanuman Kavacham - Protective armor of Hanuman
- Hanuman Bahuk - Additional sacred verses

This guide provides deep understanding of each verse with translations, meanings, stories from the Ramayana, and practical applications for modern life - all available in **English** and **हिन्दी (Hindi)**.

## Features

### 📖 Read & Study
- **3 Collections** - Hanuman Chalisa (complete), Sankat Mochan Hanumanashtak & Sundar Kaand (in progress)
- **Original Devanagari text** and transliteration
- **Word-by-word meanings** and literal translations
- **Interpretive meanings** explaining spiritual depth
- **Stories from Ramayana** providing context
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
- Requires your OpenAI API key (~$0.01 per query)

[Try Spiritual Guidance →](https://sanatan-learnings.github.io/hanuman-gpt/guidance)

### 📕 Generate Custom Books
Create personalized printable books:
- **Multiple collections**: Choose from available collections
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

**→ See the [Developer Guide](docs/guides/content-generation.md)** for:
- Local development setup
- Generating custom image themes with DALL-E 3 (~$1.72 for 43 images)
- Generating audio files with Eleven Labs (~$0.0002 for 86 files)
- **Regenerating embeddings** for the RAG system (FREE, runs locally)
- Project structure and architecture
- Testing and deployment

**→ See [CONTRIBUTING.md](CONTRIBUTING.md)** for contribution guidelines

### 🤖 Automated Verse Creation with Claude Code

For developers using [Claude Code](https://claude.ai/claude-code), use the `/verse-generator` slash command to automate the complete verse creation workflow:

```
/verse-generator Create chaupai_07 for sundar-kaand
```

**What it does:**
- Creates verse markdown file with complete content
- Generates AI image using DALL-E 3
- Generates audio (full + slow speed) using ElevenLabs
- Updates embeddings for search functionality
- Updates navigation links between verses
- Prepares git commit

**Time savings:** 30-45 minutes per verse → 5-10 minutes

See [Content Generation Guide](docs/guides/content-generation.md#automated-verse-creation-with-claude-skill) for details.

### Quick Start: Generate Verse Content

```bash
# Install sanatan-sdk
pip install sanatan-sdk

# Generate complete content for a single verse (image + audio + embeddings)
verse-generate --collection sundar-kaand --verse 5 --all --theme modern-minimalist --update-embeddings
```

**What it generates:**
- Image: `images/sundar-kaand/modern-minimalist/chaupai-05.png`
- Audio: `audio/sundar-kaand/chaupai_05_full.mp3` + `chaupai_05_slow.mp3`
- Embeddings: Updated automatically

**Cost:** ~$0.04 per verse (DALL-E 3 + ElevenLabs + embeddings)

### Regenerating Embeddings

The spiritual guidance feature uses pre-computed embeddings. To regenerate them for all collections:

```bash
verse-embeddings --multi-collection \
  --collections-file _data/collections.yml \
  --verses-dir _verses \
  --output data/embeddings.json

# Output: data/embeddings.json (~4.6MB with all collections)
```

**Cost:** ~$0.01 total (OpenAI API)

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
- Valmiki Ramayana
- Tulsidas's Shri Ramcharitmanas
- Traditional commentaries by various acharyas
- Living oral traditions of Hanuman Chalisa recitation

### Technology
Built with Jekyll and GitHub Pages. Hosted on GitHub.

## License

Created for educational, devotional, and non-commercial purposes.
May it serve the spiritual upliftment of all beings.

---

🚩 **Jai Hanuman 🏹 Jai Shri Ram**

