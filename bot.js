#!/usr/bin/env node

/**
 * Petroleum Engineering Expert System Bot
 * 
 * A bilingual (Arabic/English) Telegram bot specialized in petroleum engineering.
 * Uses Groq API (OpenAI compatible) for expert-level intelligent responses.
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const TELEGRAM_API_BASE = 'https://api.telegram.org';
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_BASE = process.env.OPENAI_API_BASE || 'https://api.groq.com/openai/v1';
const LLM_MODEL = process.env.LLM_MODEL || 'llama-3.3-70b-versatile';
const LLM_TIMEOUT_MS = 60000; // Increased to 60 seconds for complex reasoning
const CONVERSATION_HISTORY_FILE = 'conversation_history.json';

// Validate environment variables
if (!BOT_TOKEN) {
  console.error('❌ Error: TELEGRAM_BOT_TOKEN environment variable is not set');
  process.exit(1);
}

if (!OPENAI_API_KEY) {
  console.error('❌ Error: OPENAI_API_KEY environment variable is not set');
  process.exit(1);
}

console.log('✅ Expert Bot initialized with:');
console.log(`   - Telegram Bot Token: ${BOT_TOKEN.substring(0, 10)}...`);
console.log(`   - API Base: ${OPENAI_API_BASE}`);
console.log(`   - Model: ${LLM_MODEL}`);

// In-memory conversation history (persisted to file)
let conversationHistory = {};

/**
 * Load conversation history from file
 */
function loadConversationHistory() {
  try {
    if (fs.existsSync(CONVERSATION_HISTORY_FILE)) {
      const data = fs.readFileSync(CONVERSATION_HISTORY_FILE, 'utf-8');
      conversationHistory = JSON.parse(data);
      console.log(`📚 Loaded conversation history for ${Object.keys(conversationHistory).length} users`);
    }
  } catch (error) {
    console.warn('⚠️  Could not load conversation history:', error.message);
    conversationHistory = {};
  }
}

/**
 * Save conversation history to file
 */
function saveConversationHistory() {
  try {
    fs.writeFileSync(CONVERSATION_HISTORY_FILE, JSON.stringify(conversationHistory, null, 2));
  } catch (error) {
    console.error('❌ Error saving conversation history:', error.message);
  }
}

/**
 * Detect language from text (Arabic or English)
 */
function detectLanguage(text) {
  const arabicRegex = /[\u0600-\u06FF]/g;
  const arabicChars = text.match(arabicRegex) || [];
  const arabicRatio = arabicChars.length / text.length;
  return arabicRatio > 0.2 ? 'ar' : 'en';
}

/**
 * Get the expert petroleum engineering system prompt
 */
function getExpertSystemPrompt(language) {
  const basePrompt = `You are a highly experienced Senior Petroleum Engineer, technical consultant, and industry expert. 
Your objective is to act as a Petroleum Engineering Expert System.
Every response must be scientifically accurate, technically correct, logically consistent, and based on accepted engineering principles.

CORE AREAS OF EXPERTISE:
- Reservoir Engineering, PVT Analysis, Simulation, Well Testing.
- Production Engineering, Artificial Lift, Flow Assurance.
- Drilling Engineering, Mud Engineering, Cementing, MPD.
- Well Completion, Workover, Well Intervention.
- Petrophysics, Well Logging, Formation Evaluation.
- Geomechanics, Rock Mechanics.
- Pipeline Engineering, Surface Facilities.
- EOR, Unconventional Resources, CCS.
- Petroleum Economics, HSE, Digital Oilfield, AI in Petroleum.

SCIENTIFIC QUALITY STANDARDS:
- Be technically rigorous and scientifically correct.
- Replace generic explanations with professional engineering insights.
- For equations: define every variable, include SI/Field units, and state assumptions.
- Explain the physical interpretation and operational significance.
- ZERO HALLUCINATION POLICY: If information is missing, clearly state the uncertainty and ask for data. Never guess or fabricate conclusions.

ENGINEERING BEHAVIOR:
- Reason like an engineer before answering.
- Explain concepts, scientific basis, operational significance, and best practices.
- Provide practical field applications and common engineering mistakes.`;

  if (language === 'ar') {
    return `${basePrompt}

يجب أن تكون إجابتك باللغة العربية، مع الحفاظ على المصطلحات التقنية الإنجليزية بين قوسين عند الضرورة لضمان الدقة الهندسية. كن دقيقاً جداً في الحسابات والتعاريف العلمية.`;
  }

  return `${basePrompt}

Respond in English. Be precise, professional, and use standard industry terminology.`;
}

/**
 * Send a message to the user via Telegram
 */
async function sendTelegramMessage(chatId, text) {
  try {
    // Split long messages if necessary (Telegram limit is 4096)
    const chunks = text.match(/[\s\S]{1,4000}/g) || [];
    for (const chunk of chunks) {
      await axios.post(`${TELEGRAM_API_BASE}/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: chunk,
        parse_mode: 'Markdown',
      });
    }
  } catch (error) {
    console.error(`❌ Failed to send message to chat ${chatId}:`, error.message);
  }
}

/**
 * Get response from API
 */
async function getLLMResponse(messages, language) {
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('LLM request timeout')), LLM_TIMEOUT_MS)
    );

    const requestPromise = axios.post(
      `${OPENAI_API_BASE}/chat/completions`,
      {
        model: LLM_MODEL,
        messages: [
          {
            role: 'system',
            content: getExpertSystemPrompt(language),
          },
          ...messages,
        ],
        max_tokens: 2000,
        temperature: 0.3, // Lower temperature for higher technical precision
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const response = await Promise.race([requestPromise, timeoutPromise]);
    return response.data.choices[0].message.content;
  } catch (error) {
    const errorDetail = error.response ? JSON.stringify(error.response.data) : error.message;
    console.error('❌ LLM API error:', errorDetail);
    throw new Error(`LLM Error: ${errorDetail}`);
  }
}

/**
 * Get conversation history for a user
 */
function getUserHistory(userId, limit = 10) {
  if (!conversationHistory[userId]) {
    conversationHistory[userId] = [];
  }

  const history = conversationHistory[userId];
  return history.slice(Math.max(0, history.length - limit)).map((msg) => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.content,
  }));
}

/**
 * Save a message to conversation history
 */
function saveMessage(userId, sender, content, language) {
  if (!conversationHistory[userId]) {
    conversationHistory[userId] = [];
  }

  conversationHistory[userId].push({
    sender,
    content,
    language,
    timestamp: new Date().toISOString(),
  });

  // Keep only last 50 messages per user to save space
  if (conversationHistory[userId].length > 50) {
    conversationHistory[userId] = conversationHistory[userId].slice(-50);
  }

  saveConversationHistory();
}

/**
 * Process a user message
 */
async function processUserMessage(update) {
  if (!update.message || !update.message.text) return;

  const msg = update.message;
  const userId = msg.from.id.toString();
  const chatId = msg.chat.id;
  const userText = msg.text;

  console.log(`📨 Message from user ${userId}: "${userText.substring(0, 50)}..."`);

  try {
    // Detect language
    const language = detectLanguage(userText);
    
    // Save user message
    saveMessage(userId, 'user', userText, language);

    // Get conversation history
    const history = getUserHistory(userId, 10);

    // Get response from LLM
    console.log('   Calling LLM API (Groq Expert Mode)...');
    const botResponse = await getLLMResponse(
      [...history, { role: 'user', content: userText }],
      language
    );

    // Save bot response
    saveMessage(userId, 'bot', botResponse, language);

    // Send response to user
    await sendTelegramMessage(chatId, botResponse);
    console.log(`   ✅ Response sent (${botResponse.length} characters)`);
  } catch (error) {
    console.error(`❌ Error processing message from user ${userId}:`, error.message);

    // Send error message
    const errorMessage = language === 'ar' 
      ? 'عذراً، حدث خطأ تقني أثناء معالجة طلبك. يرجى المحاولة لاحقاً.' 
      : 'Sorry, a technical error occurred while processing your request. Please try again later.';
    await sendTelegramMessage(chatId, errorMessage);
  }
}

/**
 * Fetch updates from Telegram using long polling
 */
async function getUpdates(offset) {
  try {
    const response = await axios.get(
      `${TELEGRAM_API_BASE}/bot${BOT_TOKEN}/getUpdates`,
      {
        params: {
          offset,
          timeout: 20,
          allowed_updates: ['message'],
        },
      }
    );

    return response.data.result || [];
  } catch (error) {
    console.error('❌ Failed to get updates from Telegram:', error.message);
    return [];
  }
}

/**
 * Main polling loop
 */
async function startPolling() {
  let offset = 0;
  const pollInterval = 1000;

  console.log('\n🚀 Starting Expert Petroleum Bot polling...\n');

  while (true) {
    try {
      const updates = await getUpdates(offset);

      for (const update of updates) {
        await processUserMessage(update);
        offset = update.update_id + 1;
      }

      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    } catch (error) {
      console.error('❌ Polling error:', error.message);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

// Load conversation history on startup
loadConversationHistory();

// Start polling
startPolling().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

// Graceful shutdown
const shutdown = () => {
  console.log('\n\n👋 Shutting down gracefully...');
  saveConversationHistory();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
