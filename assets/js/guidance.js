/**
 * Hanuman Chalisa Spiritual Guidance - RAG System
 *
 * This script implements a client-side RAG (Retrieval Augmented Generation) pipeline:
 * 1. Loads pre-generated embeddings for all 43 verses
 * 2. Uses HuggingFace (free) for embeddings, OpenAI for chat
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
const EMBEDDING_MODEL = 'sentence-transformers/all-MiniLM-L6-v2';
const HF_API_URL = `https://router.huggingface.co/pipeline/feature-extraction/${EMBEDDING_MODEL}`;
const GPT_MODEL = 'gpt-4o'; // Can change to 'gpt-4o-mini' for lower cost
const TOP_K = 3; // Number of relevant verses to retrieve
const MAX_TOKENS = 1000;
const TEMPERATURE = 0.7;

/**
 * Initialize the guidance system on page load
 */
function initGuidanceSystem() {
    console.log('Initializing guidance system...');

    // Load embeddings
    loadEmbeddings();

    // Initialize API key
    initApiKey();

    // Set up event listeners
    setupEventListeners();

    // Update placeholders based on language
    updatePlaceholders();

    // Focus on API key input if not set, otherwise on query input
    setTimeout(() => {
        if (!apiKey) {
            document.getElementById('apiKeyInput')?.focus();
        } else {
            document.getElementById('queryInput')?.focus();
        }
    }, 100);
}

/**
 * Load embeddings.json file
 */
async function loadEmbeddings() {
    try {
        const response = await fetch('/hanuman-chalisa/embeddings.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        embeddingsData = await response.json();
        console.log(`Loaded embeddings: ${embeddingsData.verses.en.length} English + ${embeddingsData.verses.hi.length} Hindi verses`);
    } catch (error) {
        console.error('Error loading embeddings:', error);
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
 * Get embedding for user query from OpenAI API
 * Note: Uses text-embedding-3-small which has 1536 dimensions,
 * but our pre-computed embeddings use sentence-transformers (384 dimensions).
 * We'll use a simple keyword-based fallback for retrieval.
 */
async function getQueryEmbedding(query) {
    // For now, we'll use keyword-based search as a fallback
    // since mixing different embedding dimensions doesn't work well
    return null; // Signal to use keyword search instead
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

    // If no matches, return first K verses as default
    const topScored = scored.slice(0, k);
    if (topScored[0].similarity === 0) {
        console.log('No keyword matches found, using first verses as default');
        return verses.slice(0, k);
    }

    return topScored;
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

    // Sort by similarity (highest first) and take top-K
    scored.sort((a, b) => b.similarity - a.similarity);

    return scored.slice(0, k);
}

/**
 * Build system prompt with relevant verses
 */
function buildSystemPrompt(verses, lang) {
    const intro = lang === 'hi'
        ? 'आप हनुमान चालीसा के विशेषज्ञ आध्यात्मिक मार्गदर्शक हैं। उपयोगकर्ता के प्रश्न का उत्तर देने के लिए प्रासंगिक छंदों का उपयोग करें। अपनी प्रतिक्रिया में विशिष्ट छंदों का हवाला दें और व्यावहारिक आध्यात्मिक मार्गदर्शन प्रदान करें।'
        : 'You are a spiritual guide specializing in the Hanuman Chalisa. Use the relevant verses below to answer the user\'s question. Cite specific verses in your response and provide practical spiritual guidance.';

    const versesContext = verses.map((v, i) => {
        const header = lang === 'hi' ? `छंद ${i + 1}:` : `Verse ${i + 1}:`;
        return `${header} ${v.title}\n${v.metadata.transliteration}\n${v.metadata.literal_translation}`;
    }).join('\n\n');

    return `${intro}\n\nRelevant Verses:\n\n${versesContext}\n\nProvide guidance based on these verses. Be concise, respectful, and spiritually insightful.`;
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

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: GPT_MODEL,
                messages: messages,
                temperature: TEMPERATURE,
                max_tokens: MAX_TOKENS
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('OpenAI API Error Response:', error);
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

    if (!apiKey) {
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

        // Step 2: Store query for keyword search
        embeddingsData.lastQuery = query;

        // Step 3: Find relevant verses using keyword-based search
        console.log('Finding relevant verses using keyword search...');
        const relevantVerses = findRelevantVersesByKeywords(query, queryLang, TOP_K);
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
 * Add message to chat
 */
function addMessage(role, content, verses = null) {
    const messageList = document.getElementById('messageList');
    const lang = getCurrentLanguage();

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;

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

            const link = document.createElement('a');
            link.href = verse.url + (verse.url.includes('?') ? '&' : '?') + 'lang=' + lang;
            link.textContent = verse.title;
            card.appendChild(link);

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
