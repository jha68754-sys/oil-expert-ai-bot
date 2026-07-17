# Petroleum Engineering Telegram Bot 🤖

A bilingual (Arabic/English) Telegram bot specialized in petroleum engineering. Uses OpenAI API to provide intelligent responses on all aspects of petroleum engineering.

**[اقرأ النسخة العربية / Read Arabic Version](README_AR.md)**

## Features ✨

- **Bilingual**: Responds in Arabic and English
- **Petroleum Engineering Expert**: Covers all major domains:
  - Drilling Engineering
  - Production Engineering
  - Reservoir Engineering
  - Well Completion
  - Enhanced Oil Recovery (EOR)
  - Petroleum Geology
  - Well Testing
  - Pipeline Engineering
  - Health, Safety & Environment (HSE)
  - Petroleum Calculations & Formulas

- **Conversation Memory**: Maintains chat history per user
- **Free to Run**: No hosting costs (use free GitHub Actions)
- **24/7 Operation**: Runs continuously on GitHub Actions or your computer

## Quick Start 🚀

### Prerequisites

- Node.js 14+ ([download](https://nodejs.org/))
- Telegram Bot Token: `8808282761:AAFnFOt-sMTjku2YRkArQ2HWfifcxcUbYXU`
- OpenAI API Key: [Get one here](https://platform.openai.com/api-keys)

### Local Setup

```bash
# Install dependencies
npm install

# Create .env file
cat > .env << EOF
TELEGRAM_BOT_TOKEN=8808282761:AAFnFOt-sMTjku2YRkArQ2HWfifcxcUbYXU
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_API_BASE=https://api.openai.com/v1
EOF

# Run the bot
npm start
```

## GitHub Actions (Free 24/7) 🌟

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `petroleum-bot`
3. Upload the bot files

### Step 2: Add Secrets

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add two secrets:
   - `TELEGRAM_BOT_TOKEN`: `8808282761:AAFnFOt-sMTjku2YRkArQ2HWfifcxcUbYXU`
   - `OPENAI_API_KEY`: (your OpenAI API key)

### Step 3: Create Workflow

Create `.github/workflows/bot.yml`:

```yaml
name: Petroleum Bot

on:
  schedule:
    - cron: '*/5 * * * *'  # Run every 5 minutes
  workflow_dispatch:

jobs:
  run-bot:
    runs-on: ubuntu-latest
    timeout-minutes: 4
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - name: Run bot
        env:
          TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          OPENAI_API_BASE: https://api.openai.com/v1
        run: timeout 240 node bot.js || true
```

Push to GitHub and the bot will run automatically every 5 minutes! ✅

## File Structure 📁

```
petroleum-bot-standalone/
├── bot.js                    # Main bot code
├── package.json              # Node.js dependencies
├── .env                      # Environment variables (keep secret!)
├── conversation_history.json # Chat history (auto-generated)
├── README.md                 # This file
├── README_AR.md              # Arabic documentation
└── .github/workflows/
    └── bot.yml               # GitHub Actions workflow
```

## Troubleshooting 🔧

| Problem | Solution |
|---------|----------|
| `TELEGRAM_BOT_TOKEN not set` | Create `.env` file with correct token |
| `OPENAI_API_KEY not set` | Add your OpenAI API key to `.env` |
| Bot not responding | Check console for errors; verify OpenAI account has credits |
| OpenAI API errors | Ensure API key is valid and account has balance |

## Alternative Hosting Options

- **Raspberry Pi**: Run on a home device 24/7 (low power cost)
- **VPS**: DigitalOcean, Linode ($4-5/month)
- **Railway**: Free tier with limitations
- **Render**: Free tier with limitations

## FAQ ❓

**Q: Is the bot completely free?**
A: The bot code is free. OpenAI provides $5 free credits for new users.

**Q: How many messages can it handle?**
A: Depends on your OpenAI usage limit. Free tier is sufficient for personal use.

**Q: Can I customize the bot?**
A: Yes! Edit `getPetroleumSystemPrompt()` in `bot.js` to change behavior.

**Q: How are chat histories saved?**
A: Automatically in `conversation_history.json` per user.

## License 📄

MIT License

---

**Enjoy the bot! 🚀**

For questions or improvements, feel free to modify the code!
