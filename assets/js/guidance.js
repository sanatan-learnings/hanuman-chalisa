/**
 * Hanuman Chalisa Spiritual Guidance - RAG System
 *
 * This script implements a client-side RAG (Retrieval Augmented Generation) pipeline:
 * 1. Loads pre-generated embeddings across enabled collections
 * 2. Uses provider-aware query embeddings (OpenAI/Bedrock/Hugging Face) + OpenAI chat
 * 3. Detects query language (English/Hindi)
 * 4. Performs semantic search using cosine similarity
 * 5. Sends relevant verses + query to GPT-4 for spiritual guidance
 * 6. Displays AI response with verse citations
 */

// Global state
let embeddingsData = null;
let apiKey = null;
let conversationHistory = [];
let isProcessing = false;

// Configuration
const BASE_URL = ''; // Custom domain (hanumanji.ai) - no baseurl needed
const GPT_MODEL = 'gpt-4o'; // Can change to 'gpt-4o-mini' for lower cost
const TOP_K = 3; // Number of relevant verses to retrieve
const MAX_TOKENS = 300;
const TEMPERATURE = 0.7;
const DEFAULT_EMBEDDINGS_INDEX_PATH = '/data/embeddings/providers/openai/collections/index.json';
const EMBEDDINGS_CONFIG = (typeof window !== 'undefined' && window.EMBEDDINGS_CONFIG)
    ? window.EMBEDDINGS_CONFIG
    : {};
const HF_API_TOKEN_STORAGE_KEY = 'hc_hf_token';
const EMBEDDINGS_OVERRIDE_STORAGE_KEY = 'hc_embeddings_provider_override';
const PROVIDER_CONFIG_MAP = EMBEDDINGS_CONFIG.providers || {};
let runtimeEmbeddingsConfig = resolveRuntimeEmbeddingsConfig();

// Cloudflare Worker URL (set this after deploying your worker)
// If set, the worker will be used and API key won't be required from users
// Example: 'https://hanumanji-api.your-subdomain.workers.dev'
const WORKER_URL = 'https://hanumanji-api.arungupta.workers.dev'; // Leave empty to use user-provided API key mode

function resolveRuntimeEmbeddingsConfig() {
    const baseProvider = EMBEDDINGS_CONFIG.provider || 'openai';
    const overrideProvider = localStorage.getItem(EMBEDDINGS_OVERRIDE_STORAGE_KEY);
    const provider = (overrideProvider && PROVIDER_CONFIG_MAP[overrideProvider]) ? overrideProvider : baseProvider;
    const providerConfig = PROVIDER_CONFIG_MAP[provider] || {};

    return {
        provider,
        model: providerConfig.model || EMBEDDINGS_CONFIG.model || 'text-embedding-3-small',
        indexPath: providerConfig.index_path || EMBEDDINGS_CONFIG.indexPath || DEFAULT_EMBEDDINGS_INDEX_PATH
    };
}

function getHuggingFaceApiUrl() {
    return `https://router.huggingface.co/pipeline/feature-extraction/${encodeURIComponent(runtimeEmbeddingsConfig.model)}`;
}

function updateRuntimeBadge() {
    const providerEl = document.getElementById('runtimeProviderLabel');
    const modelEl = document.getElementById('runtimeModelLabel');
    if (providerEl) providerEl.textContent = runtimeEmbeddingsConfig.provider;
    if (modelEl) modelEl.textContent = runtimeEmbeddingsConfig.model;
}

function showRuntimeConfigStatus(message, isError = false) {
    const statusEl = document.getElementById('runtimeConfigStatus');
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.style.color = isError ? '#b42318' : '#666';
}

function initRuntimeConfigPanel() {
    const selectEl = document.getElementById('runtimeProviderSelect');
    if (!selectEl) return;

    selectEl.value = runtimeEmbeddingsConfig.provider;
    updateRuntimeBadge();
}

async function applyRuntimeProviderSelection() {
    const selectEl = document.getElementById('runtimeProviderSelect');
    if (!selectEl) return;

    const nextProvider = selectEl.value;
    const nextConfig = PROVIDER_CONFIG_MAP[nextProvider];
    if (!nextConfig) {
        showRuntimeConfigStatus(`Unknown provider: ${nextProvider}`, true);
        return;
    }

    runtimeEmbeddingsConfig = {
        provider: nextProvider,
        model: nextConfig.model,
        indexPath: nextConfig.index_path || DEFAULT_EMBEDDINGS_INDEX_PATH
    };

    localStorage.setItem(EMBEDDINGS_OVERRIDE_STORAGE_KEY, nextProvider);
    updateRuntimeBadge();
    showRuntimeConfigStatus('Reloading embeddings...');
    await loadEmbeddings();
}

/**
 * Initialize the guidance system on page load
 */
function initGuidanceSystem() {
    console.log('Initializing guidance system...');

    // Check if using Cloudflare Worker mode
    if (WORKER_URL) {
        console.log('Using Cloudflare Worker mode - API key not required');
        // Hide API key section when using worker
        const apiKeySection = document.getElementById('apiKeySection');
        if (apiKeySection) {
            apiKeySection.style.display = 'none';
        }
    } else {
        console.log('Using user-provided API key mode');
        // Initialize API key from localStorage
        initApiKey();
    }

    // Load embeddings
    loadEmbeddings();

    // Set up event listeners
    setupEventListeners();
    initRuntimeConfigPanel();

    // Update placeholders based on language
    updatePlaceholders();

    // Focus on query input
    setTimeout(() => {
        if (!WORKER_URL && !apiKey) {
            document.getElementById('apiKeyInput')?.focus();
        } else {
            document.getElementById('queryInput')?.focus();
        }
    }, 100);
}

/**
 * Infer collection key from URL path for backward compatibility.
 */
function inferCollectionFromUrl(url = '') {
    const segment = url.replace(/^\/+/, '').split('/')[0];
    const mapping = {
        'chalisa': 'hanuman-chalisa',
        'sundar-kaand': 'sundar-kaand',
        'sankat-mochan-hanumanashtak': 'sankat-mochan-hanumanashtak',
        'bajrang-baan': 'bajrang-baan'
    };
    return mapping[segment] || null;
}

/**
 * Normalize verse records so collection metadata is always available.
 */
function normalizeVerse(verse, fallbackCollection = null) {
    return {
        ...verse,
        collection: verse.collection || fallbackCollection || inferCollectionFromUrl(verse.url)
    };
}

/**
 * Merge a single embeddings payload into aggregated structure.
 */
function mergeEmbeddingsPayload(target, payload, fallbackCollection = null) {
    if (!payload?.verses) return;
    ['en', 'hi'].forEach(lang => {
        const verses = payload.verses[lang] || [];
        verses.forEach(verse => {
            target.verses[lang].push(normalizeVerse(verse, fallbackCollection));
        });
    });
}

/**
 * Build absolute fetch path from configured index path.
 */
function resolveAssetPath(path) {
    if (!path) return `${BASE_URL}${DEFAULT_EMBEDDINGS_INDEX_PATH}`;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${BASE_URL}${path}`;
}

/**
 * Validate loaded embeddings against active runtime config.
 */
function validateEmbeddingsCompatibility(payload) {
    const expectedProvider = runtimeEmbeddingsConfig.provider;
    const expectedModel = runtimeEmbeddingsConfig.model;

    if (expectedProvider && payload.provider && payload.provider !== expectedProvider) {
        throw new Error(`Embeddings provider mismatch: expected ${expectedProvider}, got ${payload.provider}`);
    }
    if (expectedModel && payload.model && payload.model !== expectedModel) {
        throw new Error(`Embeddings model mismatch: expected ${expectedModel}, got ${payload.model}`);
    }
}

/**
 * Load embeddings from per-collection manifest and files.
 */
async function loadEmbeddingsFromManifest(indexPath) {
    const manifestUrl = resolveAssetPath(indexPath);
    const manifestResponse = await fetch(manifestUrl);
    if (!manifestResponse.ok) {
        throw new Error(`Manifest HTTP ${manifestResponse.status}`);
    }

    const manifest = await manifestResponse.json();
    const files = Array.isArray(manifest?.files) ? manifest.files : [];
    const collections = Array.isArray(manifest?.collections) ? manifest.collections : [];
    if (files.length === 0 && collections.length === 0) {
        throw new Error('Embeddings manifest has no files');
    }

    const manifestBasePath = manifestUrl.substring(0, manifestUrl.lastIndexOf('/') + 1);
    const entries = files.length > 0
        ? files
        : collections.map(entry => ({
            collection: entry.collection,
            provider: entry.provider,
            model: entry.model,
            dimensions: entry.dimensions,
            path: entry.path?.startsWith('/')
                ? entry.path
                : `${manifestBasePath}${entry.path || ''}`
        }));

    const payloads = await Promise.all(entries.map(async (entry) => {
        const response = await fetch(resolveAssetPath(entry.path));
        if (!response.ok) {
            throw new Error(`Embeddings file HTTP ${response.status}: ${entry.path}`);
        }
        const data = await response.json();
        return { entry, data };
    }));

    const merged = {
        model: payloads[0].data.model,
        dimensions: payloads[0].data.dimensions,
        provider: payloads[0].data.provider,
        generated_at: payloads[0].data.generated_at,
        verses: { en: [], hi: [] }
    };

    payloads.forEach(({ entry, data }) => {
        mergeEmbeddingsPayload(merged, data, entry.collection || data.collection || null);
    });
    validateEmbeddingsCompatibility(merged);

    return merged;
}

/**
 * Load embeddings data from per-collection manifest/files.
 */
async function loadEmbeddings() {
    try {
        embeddingsData = await loadEmbeddingsFromManifest(runtimeEmbeddingsConfig.indexPath);
        console.log(`Loaded per-collection embeddings: ${embeddingsData.verses.en.length} English + ${embeddingsData.verses.hi.length} Hindi verses`);
        showRuntimeConfigStatus('Embeddings loaded');
    } catch (error) {
        console.error('Error loading embeddings:', error);
        embeddingsData = null;
        showRuntimeConfigStatus('Failed to load embeddings', true);
        showError('Failed to load verse embeddings. Please refresh the page.');
    }
}

/**
 * Initialize API key from localStorage
 */
function initApiKey() {
    apiKey = localStorage.getItem('hc_openai_key');
    if (apiKey) {
        showApiKeySetStatus();
    } else {
        showApiKeyPrompt();
    }
}

/**
 * Show API key prompt
 */
function showApiKeyPrompt() {
    document.getElementById('apiKeyPrompt').style.display = 'block';
    document.getElementById('apiKeySet').style.display = 'none';
}

/**
 * Show API key set status
 */
function showApiKeySetStatus() {
    document.getElementById('apiKeyPrompt').style.display = 'none';
    document.getElementById('apiKeySet').style.display = 'flex';
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Save API key
    document.getElementById('saveApiKey')?.addEventListener('click', saveApiKey);

    // Edit API key
    document.getElementById('editApiKey')?.addEventListener('click', () => {
        showApiKeyPrompt();
        document.getElementById('apiKeyInput').focus();
    });

    // Send query
    document.getElementById('sendButton')?.addEventListener('click', handleSendQuery);

    // Enter key to send (Shift+Enter for new line)
    document.getElementById('queryInput')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendQuery();
        }
    });

    // Clear chat
    document.getElementById('clearChat')?.addEventListener('click', clearChat);

    // API key input - Enter to save
    document.getElementById('apiKeyInput')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveApiKey();
        }
    });

    document.getElementById('toggleRuntimeConfig')?.addEventListener('click', () => {
        const body = document.getElementById('runtimeConfigBody');
        if (!body) return;
        body.style.display = body.style.display === 'none' ? 'flex' : 'none';
    });

    document.getElementById('applyRuntimeProvider')?.addEventListener('click', async () => {
        await applyRuntimeProviderSelection();
    });

    document.getElementById('runtimeProviderSelect')?.addEventListener('change', async () => {
        await applyRuntimeProviderSelection();
    });
}

/**
 * Save API key to localStorage
 */
function saveApiKey() {
    const input = document.getElementById('apiKeyInput');
    const key = input.value.trim();

    if (!key) {
        alert('Please enter your API key');
        return;
    }

    if (!key.startsWith('sk-')) {
        alert('Invalid API key format. OpenAI keys start with "sk-"');
        return;
    }

    apiKey = key;
    localStorage.setItem('hc_openai_key', key);
    input.value = '';
    showApiKeySetStatus();

    console.log('API key saved successfully');

    // Focus on query input
    document.getElementById('queryInput').focus();
}

/**
 * Get current language from URL or localStorage
 */
function getCurrentLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    const storedLang = localStorage.getItem('preferredLanguage');
    return urlLang || storedLang || 'en';
}

/**
 * Update input placeholders based on language
 */
function updatePlaceholders() {
    const lang = getCurrentLanguage();

    const apiKeyInput = document.getElementById('apiKeyInput');
    if (apiKeyInput) {
        const placeholder = apiKeyInput.getAttribute(`data-placeholder-${lang}`);
        if (placeholder) apiKeyInput.placeholder = placeholder;
    }

    const queryInput = document.getElementById('queryInput');
    if (queryInput) {
        const placeholder = queryInput.getAttribute(`data-placeholder-${lang}`);
        if (placeholder) queryInput.placeholder = placeholder;
    }
}

/**
 * Detect language of text (English or Hindi)
 */
function detectLanguage(text) {
    // Check for Devanagari Unicode characters (U+0900 to U+097F)
    const devanagariRegex = /[\u0900-\u097F]/;
    return devanagariRegex.test(text) ? 'hi' : 'en';
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) {
        throw new Error('Vectors must have same length');
    }

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        magnitudeA += vecA[i] * vecA[i];
        magnitudeB += vecB[i] * vecB[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) {
        return 0;
    }

    return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Mean-pool token vectors from Hugging Face feature extraction output.
 */
function meanPoolVectors(vectors) {
    if (!Array.isArray(vectors) || vectors.length === 0) {
        return [];
    }

    if (!Array.isArray(vectors[0])) {
        return vectors;
    }

    const dims = vectors[0].length;
    const pooled = new Array(dims).fill(0);
    vectors.forEach((tokenVector) => {
        for (let i = 0; i < dims; i++) {
            pooled[i] += tokenVector[i];
        }
    });
    return pooled.map((value) => value / vectors.length);
}

/**
 * Get embedding for user query from OpenAI embeddings endpoint.
 */
async function getOpenAIQueryEmbedding(query) {
    const requestBody = {
        model: runtimeEmbeddingsConfig.model,
        input: query
    };

    let response;
    if (WORKER_URL) {
        response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 'embeddings',
                ...requestBody
            })
        });
    } else {
        if (!apiKey) {
            throw new Error('OpenAI API key required for query embeddings');
        }
        response = await fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
    }

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `OpenAI embedding HTTP ${response.status}`);
    }
    const data = await response.json();
    return data?.data?.[0]?.embedding || null;
}

/**
 * Get embedding for user query from Hugging Face inference endpoint.
 */
async function getHuggingFaceQueryEmbedding(query) {
    if (WORKER_URL) {
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 'hf_embeddings',
                model: runtimeEmbeddingsConfig.model,
                input: query
            })
        });

        if (!response.ok) {
            let message = `HuggingFace embedding HTTP ${response.status}`;
            try {
                const error = await response.json();
                message = error?.error?.message || message;
            } catch (_) {
                // keep generic status fallback
            }
            throw new Error(message);
        }

        const payload = await response.json();
        if (!Array.isArray(payload)) {
            throw new Error('HuggingFace embedding response is not an array');
        }
        return meanPoolVectors(payload);
    }

    const headers = {
        'Content-Type': 'application/json'
    };
    const token = localStorage.getItem(HF_API_TOKEN_STORAGE_KEY);
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(getHuggingFaceApiUrl(), {
        method: 'POST',
        headers,
        body: JSON.stringify({
            inputs: query,
            options: { wait_for_model: true }
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HuggingFace embedding HTTP ${response.status}: ${errorText}`);
    }

    const payload = await response.json();
    if (!Array.isArray(payload)) {
        throw new Error('HuggingFace embedding response is not an array');
    }
    return meanPoolVectors(payload);
}

/**
 * Get query embedding based on active runtime embeddings provider.
 */
async function getQueryEmbedding(query) {
    if (runtimeEmbeddingsConfig.provider === 'openai') {
        return getOpenAIQueryEmbedding(query);
    }
    if (runtimeEmbeddingsConfig.provider === 'bedrock-cohere') {
        return getBedrockQueryEmbedding(query);
    }
    if (runtimeEmbeddingsConfig.provider === 'huggingface') {
        return getHuggingFaceQueryEmbedding(query);
    }

    return null;
}

/**
 * Get embedding for user query from Bedrock (via worker only).
 */
async function getBedrockQueryEmbedding(query) {
    if (!WORKER_URL) {
        throw new Error('Bedrock embeddings require WORKER_URL runtime proxy');
    }

    const response = await fetch(WORKER_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: 'bedrock_embeddings',
            model: runtimeEmbeddingsConfig.model,
            input: query
        })
    });

    if (!response.ok) {
        let message = `Bedrock embedding HTTP ${response.status}`;
        try {
            const error = await response.json();
            message = error?.error?.message || message;
        } catch (_) {
            // keep status-based fallback
        }
        throw new Error(message);
    }

    const payload = await response.json();
    const embedding = payload?.embedding;
    if (!Array.isArray(embedding)) {
        throw new Error('Bedrock embedding response missing embedding array');
    }
    return embedding;
}

/**
 * Find top-K most relevant verses using keyword-based search
 * (Fallback when embeddings are not available)
 */
function findRelevantVersesByKeywords(query, lang, k = TOP_K) {
    const verses = embeddingsData.verses[lang];
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);

    // Score verses based on keyword matches
    const scored = verses.map(verse => {
        let score = 0;
        const searchText = (
            verse.title + ' ' +
            verse.metadata.transliteration + ' ' +
            verse.metadata.literal_translation + ' ' +
            verse.metadata.devanagari
        ).toLowerCase();

        // Count keyword matches
        queryWords.forEach(word => {
            if (searchText.includes(word)) {
                score += 1;
            }
        });

        // Boost if query substring appears
        if (searchText.includes(queryLower)) {
            score += 5;
        }

        return { ...verse, similarity: score };
    });

    // Sort by score and take top-K
    scored.sort((a, b) => b.similarity - a.similarity);

    // Diversify results across collections to avoid over-clustering on one text.
    const topScored = diversifyByCollection(scored, k);

    // If no matches, keep diversified default selection.
    if (topScored[0] && topScored[0].similarity === 0) {
        console.log('No keyword matches found, using diversified verses as default');
    }

    return topScored;
}

/**
 * Diversify top results so multiple collections are represented.
 * Keeps per-collection rank order while selecting in round-robin.
 */
function diversifyByCollection(scoredVerses, k) {
    const grouped = new Map();

    scoredVerses.forEach(verse => {
        const collection = verse.collection || inferCollectionFromUrl(verse.url) || 'unknown';
        if (!grouped.has(collection)) {
            grouped.set(collection, []);
        }
        grouped.get(collection).push(verse);
    });

    const result = [];
    let addedInPass = true;

    while (result.length < k && addedInPass) {
        addedInPass = false;
        for (const bucket of grouped.values()) {
            if (bucket.length > 0 && result.length < k) {
                result.push(bucket.shift());
                addedInPass = true;
            }
        }
    }

    return result;
}

/**
 * Find top-K most relevant verses using semantic search
 */
function findRelevantVerses(queryEmbedding, lang, k = TOP_K) {
    // Use keyword search as fallback if no query embedding
    if (!queryEmbedding) {
        return findRelevantVersesByKeywords(embeddingsData.lastQuery || '', lang, k);
    }

    const verses = embeddingsData.verses[lang];

    // Calculate similarity scores
    const scored = verses.map(verse => ({
        ...verse,
        similarity: cosineSimilarity(queryEmbedding, verse.embedding)
    }));

    // Sort by similarity (highest first) and diversify by collection.
    scored.sort((a, b) => b.similarity - a.similarity);
    return diversifyByCollection(scored, k);
}

/**
 * Build system prompt with relevant verses
 */
function buildSystemPrompt(verses, lang) {
    const intro = lang === 'hi'
        ? 'आप पवित्र ग्रंथों के विशेषज्ञ आध्यात्मिक मार्गदर्शक हैं। उपयोगकर्ता के प्रश्न का उत्तर देने के लिए प्रासंगिक छंदों का उपयोग करें। अपनी प्रतिक्रिया में विशिष्ट छंदों का हवाला दें और व्यावहारिक आध्यात्मिक मार्गदर्शन प्रदान करें।'
        : 'You are a spiritual guide specializing in sacred Hindu texts. Use the relevant verses below to answer the user\'s question. Cite specific verses in your response and provide practical spiritual guidance.';

    const versesContext = verses.map((v, i) => {
        const header = lang === 'hi' ? `छंद ${i + 1}:` : `Verse ${i + 1}:`;
        const collection = v.collection ? ` (${v.collection})` : '';
        return `${header} ${v.title}${collection}\n${v.metadata.transliteration}\n${v.metadata.literal_translation}`;
    }).join('\n\n');

    const format = lang === 'hi'
        ? '\n\nअपनी प्रतिक्रिया को इस प्रकार संरचित करें:\n1. सार: मुख्य संदेश (2-3 वाक्य)\n2. व्यावहारिक कार्य: 2-3 विशिष्ट, कार्रवाई योग्य चरण\n3. छंद संदर्भ: कौन से छंद लागू होते हैं और क्यों\n\nसंक्षिप्त रहें - कुल 150 शब्दों से कम।'
        : '\n\nStructure your response as follows:\n1. **Key Insight**: Main message in 2-3 sentences\n2. **Actionable Practices**: 2-3 specific, practical steps the person can take\n3. **Verse References**: Which verses apply and why\n\nKeep it concise - under 150 words total.';

    return `${intro}\n\nRelevant Verses:\n\n${versesContext}${format}`;
}

/**
 * Get spiritual guidance from GPT-4
 */
async function getGuidance(query, verses, lang) {
    try {
        const systemPrompt = buildSystemPrompt(verses, lang);

        const messages = [
            { role: 'system', content: systemPrompt },
            ...conversationHistory,
            { role: 'user', content: query }
        ];

        const requestBody = {
            model: GPT_MODEL,
            messages: messages,
            temperature: TEMPERATURE,
            max_tokens: MAX_TOKENS
        };

        let response;

        if (WORKER_URL) {
            // Use Cloudflare Worker (no API key needed)
            console.log('Calling Cloudflare Worker:', WORKER_URL);
            response = await fetch(WORKER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
        } else {
            // Use direct OpenAI API (requires user's API key)
            console.log('Calling OpenAI API directly');
            response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
        }

        if (!response.ok) {
            const error = await response.json();
            console.error('API Error Response:', error);
            console.error('HTTP Status:', response.status);
            console.error('Error details:', {
                message: error.error?.message,
                type: error.error?.type,
                code: error.error?.code,
                param: error.error?.param
            });
            throw new Error(error.error?.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error getting guidance:', error);
        console.error('Error stack:', error.stack);
        throw error;
    }
}

/**
 * Main RAG pipeline: handles user query
 */
async function handleSendQuery() {
    const queryInput = document.getElementById('queryInput');
    const query = queryInput.value.trim();

    // Validation
    if (!query) {
        return;
    }

    // Only check for API key if not using Cloudflare Worker
    if (!WORKER_URL && !apiKey) {
        const lang = getCurrentLanguage();
        const errorMsg = lang === 'hi'
            ? 'कृपया पहले अपनी OpenAI API key सेट करें'
            : 'Please set your OpenAI API key first';
        showError(errorMsg);
        return;
    }

    if (!embeddingsData) {
        const lang = getCurrentLanguage();
        const errorMsg = lang === 'hi'
            ? 'एम्बेडिंग लोड हो रही हैं, कृपया प्रतीक्षा करें...'
            : 'Embeddings are loading, please wait...';
        showError(errorMsg);
        return;
    }

    if (isProcessing) {
        return;
    }

    isProcessing = true;

    // Clear input and disable send button
    queryInput.value = '';
    updateSendButton(false);

    // Add user message to chat
    addMessage('user', query);

    // Scroll to bottom
    scrollToBottom();

    try {
        // Show loading indicator
        showLoading();

        // Step 1: Detect language
        const queryLang = detectLanguage(query);
        console.log(`Query language: ${queryLang}`);

        // Step 2: Store query for fallback search
        embeddingsData.lastQuery = query;

        // Step 3: Generate query embedding and run retrieval
        console.log(`Generating query embedding via ${runtimeEmbeddingsConfig.provider}/${runtimeEmbeddingsConfig.model}...`);
        let queryEmbedding = null;
        try {
            queryEmbedding = await getQueryEmbedding(query);
        } catch (embeddingError) {
            const mustUseEmbeddings = runtimeEmbeddingsConfig.provider === 'bedrock-cohere';
            if (mustUseEmbeddings) {
                throw new Error(`Bedrock embeddings unavailable: ${embeddingError.message}`);
            }
            // Keep guidance available for non-Bedrock providers if live embedding lookup fails.
            console.warn('Query embedding failed, falling back to keyword retrieval:', embeddingError);
        }
        let relevantVerses;
        if (queryEmbedding) {
            console.log('Finding relevant verses using semantic similarity...');
            relevantVerses = findRelevantVerses(queryEmbedding, queryLang, TOP_K);
        } else {
            if (runtimeEmbeddingsConfig.provider === 'bedrock-cohere') {
                throw new Error('Bedrock embeddings unavailable: query embedding is empty');
            }
            console.log('No query embedding available for active provider; using keyword fallback.');
            relevantVerses = findRelevantVersesByKeywords(query, queryLang, TOP_K);
        }
        console.log(`Found ${relevantVerses.length} relevant verses:`, relevantVerses.map(v => v.title));

        // Step 4: Get GPT guidance
        console.log('Getting spiritual guidance...');
        const guidance = await getGuidance(query, relevantVerses, queryLang);

        // Hide loading indicator
        hideLoading();

        // Step 5: Display response with citations
        addMessage('assistant', guidance, relevantVerses);

        // Step 6: Update conversation history
        conversationHistory.push(
            { role: 'user', content: query },
            { role: 'assistant', content: guidance }
        );

        // Keep conversation history manageable (last 10 messages)
        if (conversationHistory.length > 10) {
            conversationHistory = conversationHistory.slice(-10);
        }

    } catch (error) {
        hideLoading();

        // Log detailed error information to console
        console.error('=== ERROR IN RAG PIPELINE ===');
        console.error('Error message:', error.message);
        console.error('Error object:', error);
        console.error('Error stack:', error.stack);
        console.error('API key (first 8 chars):', apiKey ? apiKey.substring(0, 8) + '...' : 'NOT SET');
        console.error('Query:', query);
        console.error('==============================');

        const lang = getCurrentLanguage();
        let errorMsg = lang === 'hi'
            ? 'त्रुटि: कुछ गलत हो गया। कृपया पुनः प्रयास करें।'
            : 'Error: Something went wrong. Please try again.';

        // Check if it's an OpenAI API error (GPT-4 part)
        if (error.message.includes('API key') || error.message.includes('Bearer')) {
            errorMsg = lang === 'hi'
                ? 'अमान्य OpenAI API key। कृपया अपनी key जांचें और पुनः प्रयास करें।'
                : 'Invalid OpenAI API key. Please check your key and try again.';
        } else if (error.message.includes('quota') || error.message.includes('insufficient_quota')) {
            errorMsg = lang === 'hi'
                ? 'OpenAI API सीमा पार हो गई। कृपया अपने खाते में क्रेडिट जोड़ें।'
                : 'OpenAI API quota exceeded. Please add credits to your account.';
            console.error('💡 To fix: Add credits at https://platform.openai.com/account/billing');
        } else if (error.message.includes('rate limit')) {
            errorMsg = lang === 'hi'
                ? 'API सीमा पार हो गई। कृपया बाद में पुनः प्रयास करें।'
                : 'Rate limit exceeded. Please try again later.';
        } else if (error.message.includes('HuggingFace')) {
            errorMsg = lang === 'hi'
                ? 'एम्बेडिंग सेवा त्रुटि। कृपया बाद में पुनः प्रयास करें।'
                : 'Embedding service error. Please try again later.';
        }

        showError(errorMsg);
    } finally {
        isProcessing = false;
        updateSendButton(true);
    }
}

/**
 * Convert simple markdown to HTML
 */
function markdownToHtml(text) {
    return text
        // Convert **bold** to <strong>
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Convert numbered lists to proper HTML
        .replace(/^(\d+)\.\s+\*\*(.*?)\*\*:/gm, '<br><strong>$1. $2:</strong>')
        // Add line breaks for newlines
        .replace(/\n/g, '<br>')
        // Clean up multiple <br> tags
        .replace(/(<br>\s*){3,}/g, '<br><br>');
}

/**
 * Add message to chat
 */
function addMessage(role, content, verses = null) {
    const messageList = document.getElementById('messageList');
    const lang = getCurrentLanguage();

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    // Convert markdown to HTML for better formatting
    contentDiv.innerHTML = role === 'assistant' ? markdownToHtml(content) : content;

    // Add verse citations if provided
    if (verses && verses.length > 0) {
        const citationsDiv = document.createElement('div');
        citationsDiv.className = 'verse-citations';

        const headerText = lang === 'hi' ? 'प्रासंगिक श्लोक:' : 'Relevant Verses:';
        const header = document.createElement('div');
        header.className = 'citation-header';
        header.textContent = headerText;
        citationsDiv.appendChild(header);

        verses.forEach(verse => {
            const card = document.createElement('div');
            card.className = 'citation-card';

            const titleContainer = document.createElement('div');
            titleContainer.className = 'citation-title-container';

            const link = document.createElement('a');
            link.href = BASE_URL + verse.url + (verse.url.includes('?') ? '&' : '?') + 'lang=' + lang;
            link.textContent = verse.title;
            titleContainer.appendChild(link);

            // Add collection badge if present
            const collectionName = verse.metadata?.collection_name || verse.metadata?.collection_key || verse.collection;
            if (collectionName) {
                const badge = document.createElement('span');
                badge.className = 'collection-badge';
                badge.textContent = collectionName;
                titleContainer.appendChild(badge);
            }

            card.appendChild(titleContainer);

            if (verse.metadata.devanagari) {
                const devanagari = document.createElement('div');
                devanagari.className = 'citation-devanagari';
                devanagari.textContent = verse.metadata.devanagari;
                card.appendChild(devanagari);
            }

            citationsDiv.appendChild(card);
        });

        contentDiv.appendChild(citationsDiv);
    }

    messageDiv.appendChild(contentDiv);
    messageList.appendChild(messageDiv);

    scrollToBottom();
}

/**
 * Show loading indicator
 */
function showLoading() {
    document.getElementById('loadingIndicator').style.display = 'flex';
    scrollToBottom();
}

/**
 * Hide loading indicator
 */
function hideLoading() {
    document.getElementById('loadingIndicator').style.display = 'none';
}

/**
 * Show error message
 */
function showError(message) {
    const messageList = document.getElementById('messageList');

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    messageList.appendChild(errorDiv);
    scrollToBottom();
}

/**
 * Scroll chat to bottom
 */
function scrollToBottom() {
    const chatContainer = document.getElementById('chatContainer');
    setTimeout(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 100);
}

/**
 * Update send button state
 */
function updateSendButton(enabled) {
    const sendButton = document.getElementById('sendButton');
    sendButton.disabled = !enabled;
}

/**
 * Clear chat history
 */
function clearChat() {
    const lang = getCurrentLanguage();
    const confirmMsg = lang === 'hi'
        ? 'क्या आप सभी संदेश साफ़ करना चाहते हैं?'
        : 'Are you sure you want to clear all messages?';

    if (!confirm(confirmMsg)) {
        return;
    }

    document.getElementById('messageList').innerHTML = '';
    conversationHistory = [];
    console.log('Chat cleared');
}

/**
 * Initialize on page load
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGuidanceSystem);
} else {
    initGuidanceSystem();
}

// Handle language changes
window.addEventListener('storage', (e) => {
    if (e.key === 'preferredLanguage') {
        updatePlaceholders();
    }
});
