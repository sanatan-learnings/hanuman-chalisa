# Hanuman GPT: AI Spiritual Guide

🚩 **Jai Hanuman 🏹 Jai Shri Ram**

**🌐 [View the live interactive website →](https://hanumanji.ai/)**

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

- **📖 3 Collections** - Hanuman Chalisa (43 verses, complete), Sankat Mochan Hanumanashtak (8 verses, complete), Sundar Kaand (25 verses, in progress)
- **🔤 Bilingual** - Full content in English and हिन्दी (Hindi) with word-by-word meanings, transliteration, and interpretive explanations
- **🎵 Audio Pronunciation** - Regular and slow speed for every verse (AI-generated via Eleven Labs)
- **🖼️ AI-Generated Images** - Beautiful artwork for each verse (DALL-E 3)
- **💬 Spiritual Guidance** - Ask questions and receive GPT-4 powered guidance based on relevant verses → [Try it](https://hanumanji.ai/guidance) | [Learn more](docs/reference/spiritual-guidance.md)
- **📕 Custom Books** - Generate printable books (Hanuman Chalisa only) → [Book Generator](https://hanumanji.ai/chalisa/book) | [Documentation](docs/reference/book-generation.md)
- **🔍 Search** - Find verses across all collections
- **📖 Context** - Stories from Ramayana and Puranic texts for deeper understanding

## For Developers

Want to contribute or run this locally?

### Quick Start: Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/sanatan-learnings/hanuman-gpt.git
cd hanuman-gpt

# 2. Set up Python virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install Python dependencies
pip install -r scripts/requirements.txt

# 4. Install Ruby dependencies
bundle install

# 5. Run Jekyll locally
bundle exec jekyll serve --force_polling

# Visit http://localhost:4000/
```

**→ See [Local Development Guide](docs/guides/local-development.md)** for detailed setup instructions and troubleshooting.

### Generate New Verse Content

Use `verse-generate` to create new verses with AI-generated content, images, audio, and embeddings.

**→ See [Content Generation Guide](docs/guides/content-generation.md)** for complete instructions.

### Embedding Provider Switching

Provider switching (OpenAI ↔ Bedrock Cohere), generation commands, and runtime config are documented in:

- [Embedding Provider Switching Guide](docs/guides/embedding-provider-switching.md)

## Documentation

**Guides:**
- [Local Development](docs/guides/local-development.md) - Setup and run locally
- [Content Generation](docs/guides/content-generation.md) - Generate verses with AI
- [Cloudflare Worker Setup](docs/guides/cloudflare-worker-setup.md) - Deploy API proxy

**Reference:**
- [Background](docs/reference/background.md) - About the sacred texts
- [Book Generation](docs/reference/book-generation.md) - Create printable books
- [Spiritual Guidance](docs/reference/spiritual-guidance.md) - RAG system details
- [Tech Stack](docs/reference/tech-stack.md) - Architecture and technologies
- [Multilingual](docs/reference/multilingual.md) - Internationalization

**→ See [docs/README.md](docs/README.md)** for complete documentation index.

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

### Content Sources
- **Sundar Kaand**: [Hindi Wikipedia - Sundar Kaand](https://hi.wikipedia.org/wiki/%E0%A4%B8%E0%A5%81%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A4%B0%E0%A4%95%E0%A4%BE%E0%A4%A3%E0%A5%8D%E0%A4%A1)
- **Hanuman Chalisa**: AI-generated content (OpenAI)
- **Hanuman Ashtak**: AI-generated content (OpenAI)

### Technology
Built with Jekyll, GitHub Pages, DALL-E 3, ElevenLabs, GPT-4, and sanatan-verse-sdk.

→ See [Tech Stack](docs/reference/tech-stack.md) for complete architecture and technology details

## License

Created for educational, devotional, and non-commercial purposes.
May it serve the spiritual upliftment of all beings.

---

🚩 **Jai Hanuman 🏹 Jai Shri Ram**
