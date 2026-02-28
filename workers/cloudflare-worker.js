/**
 * Cloudflare Worker - API Proxy for Hanuman GPT
 *
 * This worker securely proxies OpenAI, Hugging Face, and Bedrock requests without exposing API keys.
 * Deploy this to Cloudflare Workers and set required secrets.
 *
 * Deployment:
 *   1. Go to https://dash.cloudflare.com/
 *   2. Workers & Pages > Create Application > Create Worker
 *   3. Paste this code
 *   4. Settings > Variables > Add secrets:
 *      - OPENAI_API_KEY (for chat + OpenAI embeddings)
 *      - HF_TOKEN (for Hugging Face embeddings)
 *      - AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY (+ AWS_SESSION_TOKEN if temporary creds)
 *      - AWS_REGION (for Bedrock embeddings, e.g. us-east-1)
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
const encoder = new TextEncoder();

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

function toHex(buffer) {
  const bytes = new Uint8Array(buffer);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

async function sha256Hex(value) {
  const data = typeof value === 'string' ? encoder.encode(value) : value;
  const digest = await crypto.subtle.digest('SHA-256', data);
  return toHex(digest);
}

async function hmacSha256(keyBytes, data) {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(data));
  return new Uint8Array(signature);
}

async function getSignatureKey(secretAccessKey, dateStamp, region, service) {
  const kDate = await hmacSha256(encoder.encode(`AWS4${secretAccessKey}`), dateStamp);
  const kRegion = await hmacSha256(kDate, region);
  const kService = await hmacSha256(kRegion, service);
  return hmacSha256(kService, 'aws4_request');
}

function getAmzDate() {
  const now = new Date();
  const iso = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  return {
    amzDate: iso,
    dateStamp: iso.slice(0, 8)
  };
}

async function invokeBedrockEmbeddings(env, modelId, inputText) {
  const accessKeyId = env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = env.AWS_SECRET_ACCESS_KEY;
  const sessionToken = env.AWS_SESSION_TOKEN;
  const region = env.AWS_REGION || 'us-east-1';
  const service = 'bedrock';
  const host = `bedrock-runtime.${region}.amazonaws.com`;
  const canonicalUri = `/model/${encodeURIComponent(modelId)}/invoke`;
  const endpoint = `https://${host}${canonicalUri}`;
  const requestBody = JSON.stringify({
    texts: [inputText],
    input_type: 'search_query',
    truncate: 'END'
  });
  const payloadHash = await sha256Hex(requestBody);
  const { amzDate, dateStamp } = getAmzDate();

  const canonicalHeadersObj = {
    'content-type': 'application/json',
    'host': host,
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': amzDate
  };
  if (sessionToken) {
    canonicalHeadersObj['x-amz-security-token'] = sessionToken;
  }

  const signedHeaderKeys = Object.keys(canonicalHeadersObj).sort();
  const signedHeaders = signedHeaderKeys.join(';');
  const canonicalHeaders = signedHeaderKeys
    .map((k) => `${k}:${canonicalHeadersObj[k]}`)
    .join('\n') + '\n';

  const canonicalRequest = [
    'POST',
    canonicalUri,
    '',
    canonicalHeaders,
    signedHeaders,
    payloadHash
  ].join('\n');

  const algorithm = 'AWS4-HMAC-SHA256';
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    await sha256Hex(canonicalRequest)
  ].join('\n');

  const signingKey = await getSignatureKey(secretAccessKey, dateStamp, region, service);
  const signature = toHex(await hmacSha256(signingKey, stringToSign));

  const authorization = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const headers = {
    'Authorization': authorization,
    'Content-Type': 'application/json',
    'X-Amz-Content-Sha256': payloadHash,
    'X-Amz-Date': amzDate
  };
  if (sessionToken) {
    headers['X-Amz-Security-Token'] = sessionToken;
  }

  return fetch(endpoint, {
    method: 'POST',
    headers,
    body: requestBody
  });
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
      console.log('route=embeddings provider=openai model=', body.model || 'text-embedding-3-small');
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
      console.log('route=hf_embeddings provider=huggingface model=', body.model || 'sentence-transformers/paraphrase-multilingual-mpnet-base-v2');
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
    } else if (body.type === 'bedrock_embeddings') {
      const modelId = body.model || env.BEDROCK_EMBEDDING_MODEL || 'cohere.embed-multilingual-v3';
      console.log('route=bedrock_embeddings provider=bedrock-cohere model=', modelId);
      if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY) {
        console.error('AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY not set in worker secrets');
        return new Response(JSON.stringify({
          error: {
            message: 'Server configuration error: AWS Bedrock credentials missing',
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
            message: 'Invalid Bedrock embeddings request: string input required',
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

      const bedrockResponse = await invokeBedrockEmbeddings(env, modelId, body.input);
      const bedrockText = await bedrockResponse.text();

      if (!bedrockResponse.ok) {
        return new Response(bedrockText, {
          status: bedrockResponse.status,
          headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json',
          },
        });
      }

      let parsed;
      try {
        parsed = JSON.parse(bedrockText);
      } catch (error) {
        return new Response(JSON.stringify({
          error: {
            message: 'Invalid Bedrock response format',
            type: 'upstream_error',
          }
        }), {
          status: 502,
          headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json',
          },
        });
      }

      const embedding = Array.isArray(parsed?.embeddings) ? parsed.embeddings[0] : null;
      if (!Array.isArray(embedding)) {
        return new Response(JSON.stringify({
          error: {
            message: 'Bedrock response missing embeddings array',
            type: 'upstream_error',
          }
        }), {
          status: 502,
          headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json',
          },
        });
      }

      return new Response(JSON.stringify({
        provider: 'bedrock-cohere',
        model: modelId,
        embedding
      }), {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/json',
        },
      });
    } else if (!body.type || body.type === 'chat_openai') {
      console.log('route=chat provider=openai model=', body.model || 'gpt-4o');
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
    } else {
      return new Response(JSON.stringify({
        error: {
          message: `Unsupported request type: ${body.type}`,
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
