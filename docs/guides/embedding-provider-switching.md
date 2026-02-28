# Embedding Provider Switching

Switch runtime retrieval between OpenAI and Bedrock Cohere using one config file.

## Runtime Config

Runtime reads `_data/embeddings.yml`.

### Use OpenAI

```yml
active_provider: openai
active_model: text-embedding-3-small
index_path: /data/embeddings/providers/openai/collections/index.json
```

### Use Bedrock Cohere

```yml
active_provider: bedrock-cohere
active_model: cohere.embed-multilingual-v3
index_path: /data/embeddings/providers/bedrock-cohere-embed-multilingual-v3/collections/index.json
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

## Validation Checklist

1. `bundle exec jekyll build` succeeds.
2. `/guidance` loads without embeddings errors.
3. Results for a few test queries look reasonable in both English and Hindi.
