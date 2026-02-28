# Embedding Provider Switching

Switch runtime retrieval between OpenAI, Bedrock Cohere, and Hugging Face using one config file.

## Runtime Config

Runtime reads `_data/embeddings.yml`.

### Canonical Structure

```yml
active_provider: openai # change only this to switch runtime provider

providers:
  openai:
    model: text-embedding-3-small
    index_path: /data/embeddings/providers/openai/collections/index.json
  bedrock-cohere:
    model: cohere.embed-multilingual-v3
    index_path: /data/embeddings/providers/bedrock-cohere-embed-multilingual-v3/collections/index.json
  huggingface:
    model: sentence-transformers/paraphrase-multilingual-mpnet-base-v2
    index_path: /data/embeddings/providers/huggingface-paraphrase-multilingual-mpnet-base-v2/collections/index.json
```

After changing the file, rebuild/redeploy the site.

## Generate OpenAI Embeddings

```bash
source venv/bin/activate
verse-embeddings --multi-collection \
  --provider openai \
  --collections-file _data/collections.yml \
  --output-dir data/embeddings/providers/openai/collections
```

## Generate Bedrock Cohere Embeddings

```bash
source venv/bin/activate
unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN AWS_DEFAULT_PROFILE AWS_DEFAULT_REGION
export AWS_PROFILE=default AWS_REGION=us-east-1
verse-embeddings --multi-collection \
  --provider bedrock-cohere \
  --collections-file _data/collections.yml \
  --output-dir data/embeddings/providers/bedrock-cohere-embed-multilingual-v3/collections
```

## Generate Hugging Face Multilingual Embeddings

```bash
source venv/bin/activate
verse-embeddings --multi-collection \
  --provider huggingface \
  --model sentence-transformers/paraphrase-multilingual-mpnet-base-v2 \
  --collections-file _data/collections.yml \
  --output-dir data/embeddings/providers/huggingface-paraphrase-multilingual-mpnet-base-v2/collections
```

## Runtime Notes

1. OpenAI: semantic retrieval works in-browser using OpenAI query embeddings.
2. Hugging Face: semantic retrieval works in-browser using Hugging Face inference API.
3. Bedrock Cohere: semantic retrieval works via Cloudflare Worker Bedrock proxy.
4. Bedrock requires worker secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, optional `AWS_SESSION_TOKEN`, plus `AWS_REGION`.
5. Bedrock runtime now fails closed if query embedding cannot be generated (no silent keyword fallback).

## Validation Checklist

1. `bundle exec jekyll build` succeeds.
2. `/guidance` loads without embeddings errors.
3. Results for a few test queries look reasonable in both English and Hindi.
4. For Bedrock active provider, a direct worker test with `type: bedrock_embeddings` returns an embedding vector.
