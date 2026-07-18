#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');

const TELEGRAM_API_BASE = 'https://api.telegram.org';
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_BASE = process.env.OPENAI_API_BASE || 'https://api.groq.com/openai/v1';
const LLM_MODEL = 'llama-3.3-70b-versatile';
const CONVERSATION_HISTORY_FILE = 'conversation_history.json';

if (!BOT_TOKEN || !OPENAI_API_KEY) { process.exit(1); }

let conversationHistory = {};
try { if (fs.existsSync(CONVERSATION_HISTORY_FILE)) conversationHistory = JSON.parse(fs.readFileSync(CONVERSATION_HISTORY_FILE, 'utf-8')); } catch (e) {}

async function sendTelegramMessage(chatId, text) {
  try {
    await axios.post(`${TELEGRAM_API_BASE}/bot${BOT_TOKEN}/sendMessage`, { chat_id: chatId, text: text, parse_mode: 'Markdown' });
  } catch (error) {
    try { await axios.post(`${TELEGRAM_API_BASE}/bot${BOT_TOKEN}/sendMessage`, { chat_id: chatId, text: text }); } catch (e) {}
  }
}

async function getLLMResponse(messages, language) {
  const systemPrompt = language === 'ar' 
    ? "أنت خبير في الهندسة النفطية. أجب بدقة علمية وباللغة العربية مع ذكر المصطلحات الإنجليزية." 
    : "You are a Senior Petroleum Engineering Expert. Provide technically accurate and professional responses.";
  
  const response = await axios.post(`${OPENAI_API_BASE}/chat/completions`, {
    model: LLM_MODEL,
    messages: [{ role: 'system', content: systemPrompt }, ...messages],
    temperature: 0.3,
  }, {
    headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    timeout: 30000
  });
  return response.data.choices[0].message.content;
}

async function processUserMessage(update) {
  if (!update.message || !update.message.text) return;
  const chatId = update.message.chat.id;
  const userText = update.message.text;
  const language = /[\u0600-\u06FF]/.test(userText) ? 'ar' : 'en';

  try {
    const history = (conversationHistory[chatId] || []).slice(-4).map(m => ({ role: m.role, content: m.content }));
    const botResponse = await getLLMResponse([...history, { role: 'user', content: userText }], language);
    
    if (!conversationHistory[chatId]) conversationHistory[chatId] = [];
    conversationHistory[chatId].push({ role: 'user', content: userText }, { role: 'assistant', content: botResponse });
    if (conversationHistory[chatId].length > 20) conversationHistory[chatId] = conversationHistory[chatId].slice(-20);
    fs.writeFileSync(CONVERSATION_HISTORY_FILE, JSON.stringify(conversationHistory, null, 2));

    await sendTelegramMessage(chatId, botResponse);
  } catch (error) {
    console.error("Error:", error.response ? JSON.stringify(error.response.data) : error.message);
    await sendTelegramMessage(chatId, "عذراً، حدث خطأ تقني. يرجى المحاولة لاحقاً.");
  }
}

async function startPolling() {
  let offset = 0;
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

startPolling();
