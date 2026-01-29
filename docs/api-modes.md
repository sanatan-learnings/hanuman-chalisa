# Spiritual Guidance API Configuration

The spiritual guidance feature uses OpenAI's API through a Cloudflare Worker proxy for secure, frictionless access.

## Current Setup: Cloudflare Worker

**Architecture:**
```
User Browser → Cloudflare Worker → OpenAI API → Response
                (proxies request)   (GPT-4 + embeddings)
```

**Benefits:**
- ✅ Users don't need their own OpenAI API key
- ✅ Frictionless experience (no signup required)
- ✅ API key securely stored as Cloudflare secret
- ✅ Rate limiting built-in (10 req/min per IP)
- ✅ Free Cloudflare tier (100k requests/day)
- ✅ Works with GitHub Pages hosting

**Configuration:**
```javascript
// assets/js/guidance.js
const WORKER_URL = 'https://hanuman-chalisa-api.arungupta.workers.dev';
```

## How It Works

1. User asks a question in the guidance interface
2. Browser sends request to Cloudflare Worker
3. Worker validates and rate-limits the request
4. Worker forwards to OpenAI API (using secure API key)
5. OpenAI returns spiritual guidance response
6. Worker sends response back to browser

## Cost

- **Cloudflare Worker**: Free (within 100k requests/day limit)
- **OpenAI API**: ~$0.01 per query
  - Query embedding: ~$0.0000004
  - GPT-4o input: ~$0.005
  - GPT-4o output: ~$0.005

**Example**: 100 queries/day = $1/day = ~$30/month

## Security

- API key stored as Cloudflare Worker secret (never exposed to users)
- Rate limiting prevents abuse (10 requests/min per IP address)
- CORS configured to accept requests from any origin (can be restricted to your domain)
- No sensitive user data stored

## Alternative: User-Provided API Key

The code supports an alternative mode where users provide their own OpenAI API keys:

```javascript
// To enable user-provided key mode:
const WORKER_URL = ''; // Empty string
```

This removes all costs for you but adds friction (users must create OpenAI accounts and enter API keys).

**Not currently used** - keeping Cloudflare Worker for better UX.

## Deployment

See [cloudflare-worker-setup.md](cloudflare-worker-setup.md) for deployment instructions.
