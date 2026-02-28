/**
 * Cloudflare Worker - API Proxy for Hanuman GPT
 *
 * This worker securely proxies OpenAI and Hugging Face requests without exposing API keys.
 * Deploy this to Cloudflare Workers and set OPENAI_API_KEY / HF_TOKEN as secrets.
 *
 * Deployment:
 *   1. Go to https://dash.cloudflare.com/
 *   2. Workers & Pages > Create Application > Create Worker
 *   3. Paste this code
 *   4. Settings > Variables > Add secrets:
 *      - OPENAI_API_KEY (for chat + OpenAI embeddings)
 *      - HF_TOKEN (for Hugging Face embeddings)
 *   5. Copy worker URL (e.g., https://hanumanji-api.your-subdomain.workers.dev)
 *   6. Update WORKER_URL in assets/js/guidance.js
 */

// CORS headers for browser requests
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*', // Change to your domain for better security: 'https://sanatan-learnings.github.io'
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Rate limiting configuration (optional but recommended)
const RATE_LIMIT = {
  requests: 10,    // Max requests
  per: 60 * 1000,  // Per 60 seconds
};

// Simple in-memory rate limiter (resets on worker restart)
const rateLimitMap = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, resetAt: now + RATE_LIMIT.per };

  // Reset if time window expired
  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + RATE_LIMIT.per;
  }

  record.count++;
  rateLimitMap.set(ip, record);

  return record.count <= RATE_LIMIT.requests;
}

async function handleRequest(request, env) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: CORS_HEADERS,
    });
  }

  // Only allow POST
  if (request.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: CORS_HEADERS,
    });
  }

  try {
    // Rate limiting (optional)
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (!checkRateLimit(ip)) {
      return new Response(JSON.stringify({
        error: {
          message: 'Rate limit exceeded. Please try again later.',
          type: 'rate_limit_error',
        }
      }), {
        status: 429,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/json',
        },
      });
    }

    // Get request body
    const body = await request.json();

    let upstreamResponse;
    if (body.type === 'embeddings') {
      if (!env.OPENAI_API_KEY) {
        console.error('OPENAI_API_KEY not set in worker secrets');
        return new Response(JSON.stringify({
          error: {
            message: 'Server configuration error: OPENAI_API_KEY missing',
            type: 'configuration_error',
          }
        }), {
          status: 500,
          headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json',
          },
        });
      }

      if (!body.input || typeof body.input !== 'string') {
        return new Response(JSON.stringify({
          error: {
            message: 'Invalid embeddings request: string input required',
            type: 'invalid_request_error',
          }
        }), {
          status: 400,
          headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json',
          },
        });
      }

      upstreamResponse = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: body.model || 'text-embedding-3-small',
          input: body.input,
        }),
      });
    } else if (body.type === 'hf_embeddings') {
      if (!env.HF_TOKEN) {
        console.error('HF_TOKEN not set in worker secrets');
        return new Response(JSON.stringify({
          error: {
            message: 'Server configuration error: HF_TOKEN missing',
            type: 'configuration_error',
          }
        }), {
          status: 500,
          headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json',
          },
        });
      }

      if (!body.input || typeof body.input !== 'string') {
        return new Response(JSON.stringify({
          error: {
            message: 'Invalid Hugging Face embeddings request: string input required',
            type: 'invalid_request_error',
          }
        }), {
          status: 400,
          headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json',
          },
        });
      }

      const model = body.model || 'sentence-transformers/paraphrase-multilingual-mpnet-base-v2';
      const hfUrl = `https://router.huggingface.co/pipeline/feature-extraction/${encodeURIComponent(model)}`;

      upstreamResponse = await fetch(hfUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: body.input,
          options: { wait_for_model: true },
        }),
      });
    } else {
      if (!env.OPENAI_API_KEY) {
        console.error('OPENAI_API_KEY not set in worker secrets');
        return new Response(JSON.stringify({
          error: {
            message: 'Server configuration error: OPENAI_API_KEY missing',
            type: 'configuration_error',
          }
        }), {
          status: 500,
          headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json',
          },
        });
      }

      // Validate chat request
      if (!body.messages || !Array.isArray(body.messages)) {
        return new Response(JSON.stringify({
          error: {
            message: 'Invalid request: messages array required',
            type: 'invalid_request_error',
          }
        }), {
          status: 400,
          headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json',
          },
        });
      }

      // Forward chat completion request to OpenAI
      upstreamResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: body.model || 'gpt-4o',
          messages: body.messages,
          temperature: body.temperature || 0.7,
          max_tokens: body.max_tokens || 1000,
        }),
      });
    }

    // Return upstream response with CORS headers
    const responseData = await upstreamResponse.text();
    return new Response(responseData, {
      status: upstreamResponse.status,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Worker error:', error);
    return new Response(JSON.stringify({
      error: {
        message: error.message || 'Internal server error',
        type: 'internal_error',
      }
    }), {
      status: 500,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'application/json',
      },
    });
  }
}

// Cloudflare Workers entry point
export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env);
  },
};
