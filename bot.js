#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');

// Configuration
const TELEGRAM_API_BASE = 'https://api.telegram.org';
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_BASE = process.env.OPENAI_API_BASE || 'https://api.groq.com/openai/v1';
const LLM_MODEL = process.env.LLM_MODEL || 'llama-3.3-70b-versatile';
const LLM_TIMEOUT_MS = 60000;
const CONVERSATION_HISTORY_FILE = 'conversation_history.json';

if (!BOT_TOKEN || !OPENAI_API_KEY) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

console.log('✅ Expert Bot V2 initialized');

let conversationHistory = {};

function loadConversationHistory() {
  try {
    if (fs.existsSync(CONVERSATION_HISTORY_FILE)) {
      conversationHistory = JSON.parse(fs.readFileSync(CONVERSATION_HISTORY_FILE, 'utf-8'));
    }
  } catch (e) { conversationHistory = {}; }
}

function saveConversationHistory() {
  try {
    fs.writeFileSync(CONVERSATION_HISTORY_FILE, JSON.stringify(conversationHistory, null, 2));
  } catch (e) {}
}

function getExpertSystemPrompt(language) {
  const base = `You are a Senior Petroleum Engineering Expert System. 
Be scientifically rigorous, accurate, and professional. 
Explain concepts, physical interpretations, and field applications. 
Use SI/Field units. ZERO HALLUCINATION POLICY.`;
  return language === 'ar' ? `${base} Respond in Arabic with English technical terms in brackets.` : base;
}

async function sendTelegramMessage(chatId, text) {
  try {
    // Try sending with Markdown first
    await axios.post(`${TELEGRAM_API_BASE}/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: text,
      parse_mode: 'Markdown',
    });
  } catch (error) {
    console.error(`⚠️ Failed to send with Markdown, trying plain text:`, error.response ? error.response.data : error.message);
    try {
      // Fallback to plain text if Markdown fails (common with complex symbols)
      await axios.post(`${TELEGRAM_API_BASE}/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: text,
      });
      console.log('✅ Sent successfully as plain text');
    } catch (e) {
      console.error(`❌ Fatal: Could not send message at all:`, e.response ? e.response.data : e.message);
    }
  }
}

async function getLLMResponse(messages, language) {
  const response = await axios.post(`${OPENAI_API_BASE}/chat/completions`, {
    model: LLM_MODEL,
    messages: [{ role: 'system', content: getExpertSystemPrompt(language) }, ...messages],
    temperature: 0.2, stream: false,
  }, {
    headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    timeout: LLM_TIMEOUT_MS
  });
  return response.data.choices[0].message.content;
}

async function processUserMessage(update) {
  if (!update.message || !update.message.text) return;
  const chatId = update.message.chat.id;
  const userText = update.message.text;
  const language = /[\u0600-\u06FF]/.test(userText) ? 'ar' : 'en';

  console.log(`📨 Received: ${userText.substring(0, 30)}...`);

  try {
    const history = (conversationHistory[chatId] || []).slice(-10).map(m => ({ role: m.role, content: m.content }));
    const botResponse = await getLLMResponse([...history, { role: 'user', content: userText }], language);
    
    if (!conversationHistory[chatId]) conversationHistory[chatId] = [];
    conversationHistory[chatId].push({ role: 'user', content: userText });
    conversationHistory[chatId].push({ role: 'assistant', content: botResponse });
    saveConversationHistory();

    await sendTelegramMessage(chatId, botResponse);
  } catch (error) {
    console.error(`❌ Process Error:`, error.response ? JSON.stringify(error.response.data) : error.message);
    await sendTelegramMessage(chatId, "عذراً، حدث خطأ تقني. يرجى المحاولة لاحقاً.");
  }
}

async function startPolling() {
  let offset = 0;
  console.log('🚀 Polling started...');
  while (true) {
    try {
      const res = await axios.get(`${TELEGRAM_API_BASE}/bot${BOT_TOKEN}/getUpdates`, { params: { offset, timeout: 20 } });
      for (const update of res.data.result || []) {
        await processUserMessage(update);
        offset = update.update_id + 1;
      }
    } catch (e) { await new Promise(r => setTimeout(r, 5000)); }
  }
}

loadConversationHistory();
startPolling();
