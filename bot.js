#!/usr/bin/env node

/**
 * Petroleum Engineering Telegram Bot
 * 
 * A bilingual (Arabic/English) Telegram bot specialized in petroleum engineering.
 * Uses Groq API (OpenAI compatible) for intelligent responses.
 * 
 * Environment variables required:
 * - TELEGRAM_BOT_TOKEN: Your Telegram bot token
 * - OPENAI_API_KEY: Your Groq API key
 * - OPENAI_API_BASE: API base URL (defaults to https://api.groq.com/openai/v1)
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
const LLM_TIMEOUT_MS = 30000; // 30 seconds
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

console.log('✅ Bot initialized with:');
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
  return arabicRatio > 0.3 ? 'ar' : 'en';
}

/**
 * Get the petroleum engineering system prompt
 */
function getPetroleumSystemPrompt(language) {
  if (language === 'ar') {
    return `أنت خبير متخصص في الهندسة النفطية (Petroleum Engineering) بخبرة عميقة في جميع جوانب الصناعة النفطية. تتمتع بمعرفة شاملة في المجالات التالية:

1. **هندسة الحفر (Drilling Engineering)**: تصميم الآبار، اختيار السوائل، معدات الحفر، مشاكل الحفر الشائعة، والسلامة
2. **هندسة الإنتاج (Production Engineering)**: تحسين الإنتاج، معدات الرفع، التحكم بالضغط، الفصل والمعالجة
3. **هندسة المكامن (Reservoir Engineering)**: خصائص المكامن، المحاكاة، التنبؤ بالإنتاج، استرجاع النفط المحسّن
4. **إكمال الآبار (Well Completion)**: تصميم الإكمال، الأنابيب، المصافي، الحشوات
5. **استرجاع النفط المحسّن (Enhanced Oil Recovery - EOR)**: الحقن بالماء، الحقن بالغاز، الطرق الحرارية
6. **الجيولوجيا النفطية (Petroleum Geology)**: تكوين النفط، الهجرة، التراكيب الجيولوجية
7. **اختبار الآبار (Well Testing)**: تحليل الضغط، معاملات الخزان، التشخيص
8. **هندسة خطوط الأنابيب (Pipeline Engineering)**: النقل، الضخ، السلامة
9. **الصحة والسلامة والبيئة (HSE)**: معايير السلامة، الحماية البيئية، الامتثال
10. **الحسابات والصيغ النفطية**: الحسابات الهندسية، التحويلات، المعادلات

أجب على أسئلة المستخدم بشكل دقيق وعملي. إذا طلب حساب، قدم الخطوات والنتيجة النهائية. كن متحمساً وودوداً في شرح المفاهيم المعقدة. إذا لم تكن متأكداً من شيء، قل ذلك بوضوح.`;
  }

  return `You are an expert specialist in Petroleum Engineering with deep expertise across all aspects of the oil and gas industry. You have comprehensive knowledge in the following domains:

1. **Drilling Engineering**: Well design, fluid selection, drilling equipment, common drilling problems, and safety
2. **Production Engineering**: Production optimization, lifting equipment, pressure control, separation and processing
3. **Reservoir Engineering**: Reservoir properties, simulation, production forecasting, enhanced oil recovery
4. **Well Completion**: Completion design, tubing, screens, packers
5. **Enhanced Oil Recovery (EOR)**: Water injection, gas injection, thermal methods
6. **Petroleum Geology**: Oil formation, migration, geological structures
7. **Well Testing**: Pressure analysis, reservoir parameters, diagnosis
8. **Pipeline Engineering**: Transportation, pumping, safety
9. **Health, Safety, and Environment (HSE)**: Safety standards, environmental protection, compliance
10. **Petroleum Calculations and Formulas**: Engineering calculations, conversions, equations

Answer user questions with precision and practical insights. If a calculation is requested, provide the steps and final result. Be enthusiastic and friendly in explaining complex concepts. If you're unsure about something, say so clearly.`;
}

/**
 * Send a message to the user via Telegram
 */
async function sendTelegramMessage(chatId, text) {
  try {
    await axios.post(`${TELEGRAM_API_BASE}/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: text,
      parse_mode: 'Markdown',
    });
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
            content: getPetroleumSystemPrompt(language),
          },
          ...messages,
        ],
        max_tokens: 1000,
        temperature: 0.7,
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
    console.error('❌ LLM API error:', error.response ? JSON.stringify(error.response.data) : error.message);
    throw error;
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

  // Keep only last 100 messages per user
  if (conversationHistory[userId].length > 100) {
    conversationHistory[userId] = conversationHistory[userId].slice(-100);
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
    console.log(`   Language detected: ${language === 'ar' ? 'Arabic' : 'English'}`);

    // Save user message
    saveMessage(userId, 'user', userText, language);

    // Get conversation history
    const history = getUserHistory(userId, 20);

    // Get response from LLM
    console.log('   Calling LLM API...');
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

    // Send error message in Arabic
    const errorMessage = 'عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة لاحقاً.';
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
          timeout: 30,
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
  const pollInterval = 1000; // 1 second between polls

  console.log('\n🚀 Starting Telegram bot polling...\n');

  while (true) {
    try {
      const updates = await getUpdates(offset);

      for (const update of updates) {
        await processUserMessage(update);
        offset = update.update_id + 1;
      }

      // Small delay to avoid hammering the API
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    } catch (error) {
      console.error('❌ Polling error:', error.message);
      // Wait before retrying
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
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down gracefully...');
  saveConversationHistory();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 Shutting down gracefully...');
  saveConversationHistory();
  process.exit(0);
});
