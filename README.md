# Hanuman Chalisa: A Comprehensive Guide

🚩 **Jai Hanuman 🏹 Jai Shri Ram**

**🌐 [View the live interactive website →](https://sanatan-learnings.github.io/hanuman-chalisa/)**

_May Lord Hanuman's blessings be with all who study and recite these sacred verses._

---

## About

A detailed, verse-by-verse exploration of the Hanuman Chalisa - one of the most revered devotional hymns in Hinduism. Composed by poet-saint Goswami Tulsidas, it consists of 40 verses (chaupais) glorifying Lord Hanuman's virtues and devotion to Lord Rama.

This guide provides deep understanding of each verse with translations, meanings, stories from the Ramayana, and practical applications for modern life - all available in **English** and **हिन्दी (Hindi)**.

## Features

### 📖 Read & Study
- **43 verses** with original Devanagari text and transliteration
- **Word-by-word meanings** and literal translations
- **Interpretive meanings** explaining spiritual depth
- **Stories from Ramayana** providing context
- **Search functionality** across all verses
- **Bilingual support** - Switch between English and Hindi instantly
- **Beautiful AI-generated images** for each verse

### 🎵 Audio Pronunciation
- **86 audio files** - Every verse in two speeds (full and slow)
- **Full speed** - Natural recitation pace for experienced practitioners
- **Slow speed** - 25% slower for learning pronunciation
- **AI-generated** - Clear, natural Hindi/Sanskrit pronunciation via Eleven Labs
- **Embedded players** - Listen directly on each verse page
- Perfect for learning correct pronunciation and recitation practice

### 💬 Spiritual Guidance (AI-Powered)
- **Ask questions** and receive spiritual guidance based on relevant verses
- **RAG system** - Finds and cites specific verses for your questions
- **GPT-4 powered** - Thoughtful, context-aware responses
- **Bilingual** - Works in English and Hindi
- **Conversation history** - Maintains context for follow-up questions
- Requires your OpenAI API key (~$0.01 per query)

[Try Spiritual Guidance →](https://sanatan-learnings.github.io/hanuman-chalisa/guidance)

### 📕 Generate Custom Books
Create personalized printable books:
- **Multiple sizes**: 6"×4" pocket, 8"×6" medium, A5, A4
- **Customizable content**: Choose what to include
- **Custom headers/footers**: Personalize with your own text
- **Print or PDF**: Ready for home or professional printing

[Visit Book Generator →](https://sanatan-learnings.github.io/hanuman-chalisa/book)

### 🎨 Multiple Themes
- Switch between different artistic styles
- Current: Modern Minimalist theme
- Generate your own themes using DALL-E 3 (see below)

## For Developers

Want to contribute or generate custom themes?

**→ See the [Developer Guide](docs/developer-guide.md)** for:
- Local development setup
- Generating custom image themes with DALL-E 3 (~$2 for 47 images)
- Generating audio files with Eleven Labs (~$0.02 for 86 files)
- **Regenerating embeddings** for the RAG system (FREE, runs locally)
- Project structure and architecture
- Testing and deployment

**→ See [CONTRIBUTING.md](CONTRIBUTING.md)** for contribution guidelines

### Regenerating Embeddings (For New Languages)

The spiritual guidance feature uses pre-computed embeddings. To regenerate them (e.g., when adding new language translations):

```bash
# Set up Python virtual environment (first time only)
python3 -m venv venv
./venv/bin/pip install sentence-transformers

# Generate embeddings locally (FREE, no API needed)
./venv/bin/python scripts/generate_embeddings_local.py

# Output: data/embeddings.json (~1.1MB)
```

**Cost:** FREE - runs locally on your machine, no API calls required!

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

**Upcoming Features:** Check [GitHub Issues](https://github.com/sanatan-learnings/hanuman-chalisa/issues)

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

