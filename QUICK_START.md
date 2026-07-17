# Quick Start Guide 🚀

## Choose Your Path

### Option 1: Run Locally (5 minutes) 💻

```bash
# 1. Install dependencies
npm install

# 2. Create .env file with:
# TELEGRAM_BOT_TOKEN=8808282761:AAFnFOt-sMTjku2YRkArQ2HWfifcxcUbYXU
# OPENAI_API_KEY=your_api_key_here
# OPENAI_API_BASE=https://api.openai.com/v1

# 3. Run
npm start
```

### Option 2: GitHub Actions (Free 24/7) 🌟

1. Create GitHub repo
2. Upload files
3. Add secrets: `TELEGRAM_BOT_TOKEN` and `OPENAI_API_KEY`
4. Create `.github/workflows/bot.yml` (included)
5. Done! Bot runs every 5 minutes automatically

---

## Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy and save it
4. Add to `.env` as `OPENAI_API_KEY`

---

## Test the Bot

Send a message to the bot on Telegram:

**Arabic:**
```
ما هو الفرق بين الحفر الرطب والجاف؟
```

**English:**
```
What is the difference between wet drilling and dry drilling?
```

Bot will respond in the same language! ✅

---

## File Structure

```
bot.js              - Main bot code
package.json        - Dependencies
.env                - Your secrets (create this)
README.md           - English docs
README_AR.md        - Arabic docs
SETUP_AR.md         - Detailed Arabic setup
.github/workflows/  - GitHub Actions config
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Bot won't start | Check `.env` file exists with correct values |
| No response from bot | Verify OpenAI API key is valid and has credits |
| GitHub Actions error | Check secrets are added correctly |

---

## Need Help?

- Read `README_AR.md` for detailed Arabic instructions
- Read `SETUP_AR.md` for step-by-step setup guide
- Check console output for error messages

---

**Ready? Start with:** `npm install && npm start`
