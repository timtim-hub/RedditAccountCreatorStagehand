# 🤖 Reddit Account Creator Bot with Claude AI

A powerful Reddit account creation automation tool built with Stagehand and powered by Anthropic's Claude 3.5 Sonnet AI.

## ✨ Features

- **AI-Powered Automation**: Uses Claude 3.5 Sonnet for intelligent browser interactions
- **Bulk Account Creation**: Automatically creates multiple Reddit accounts from a list
- **Email Verification**: Automatically retrieves verification codes from GMX email accounts
- **Rate Limiting Protection**: Built-in delays to avoid Reddit's anti-bot measures
- **Local Browser Support**: Runs on your local machine with Playwright

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- GMX email accounts (configured in `config/email_pass_list.txt`)
- Claude API key from Anthropic

### Installation

1. **Clone the repository** (already done)
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env and add your API keys
   ANTHROPIC_API_KEY=your_claude_api_key_here
   ```

4. **Configure email accounts**:
   Edit `config/email_pass_list.txt` with your GMX email accounts:
   ```
   email1@gmx.com:password1
   email2@gmx.com:password2
   ```

### Running the Bot

```bash
# Start the account creation process
npm start

# Or build and run
npm run build
npm start
```

## ⚙️ Configuration

### Environment Variables

- `ANTHROPIC_API_KEY`: Your Claude API key (required)
- `BROWSERBASE_PROJECT_ID`: For cloud browser execution (optional)
- `BROWSERBASE_API_KEY`: For cloud browser execution (optional)

### Bot Settings

The bot is configured in `stagehand.config.ts`:
- **AI Model**: Claude 3.5 Sonnet (configurable)
- **Browser**: Local Playwright browser
- **Viewport**: 1024x768
- **Verbosity**: Level 1 (info logging)

## 🔧 How It Works

1. **Initialization**: Stagehand starts a local browser instance
2. **Account List**: Reads email/password pairs from config file
3. **Registration**: For each account:
   - Navigates to Reddit registration page
   - Fills in email and password using Claude AI
   - Waits for verification code field
   - Retrieves verification code from GMX email
   - Submits verification code
   - Adds delay to avoid rate limiting

## 📁 Project Structure

```
acccreator/
├── index.ts                 # Main bot logic
├── stagehand.config.ts      # Stagehand configuration
├── llm_clients/            # AI client implementations
│   ├── anthropic_client.ts # Claude AI client
│   └── customOpenAI_client.ts
├── config/                 # Configuration files
│   └── email_pass_list.txt # Email/password list
├── utils.ts                # Utility functions
└── package.json            # Dependencies
```

## 🛡️ Safety Features

- **Rate Limiting**: 5-second delays between account creations
- **Error Handling**: Graceful failure handling for individual accounts
- **Logging**: Comprehensive logging for debugging
- **Timeout Protection**: 60-second timeout for verification code fields

## ⚠️ Important Notes

- **Use Responsibly**: Only create accounts for legitimate purposes
- **Respect Reddit's Terms**: Ensure compliance with Reddit's policies
- **Email Accounts**: Use real GMX email accounts for verification
- **Rate Limiting**: The bot includes delays to avoid triggering anti-bot measures

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**: Run `npm run build` to check for TypeScript errors
2. **Browser Issues**: Ensure Playwright is installed (`npx playwright install`)
3. **API Key Errors**: Verify your Claude API key is correctly set in `.env`
4. **Email Issues**: Check GMX account credentials and IMAP settings

### Debug Mode

Increase logging verbosity in `stagehand.config.ts`:
```typescript
verbose: 2 // 0 = silent, 1 = info, 2 = all
```

## 📚 Dependencies

- **@browserbasehq/stagehand**: Browser automation framework
- **@anthropic-ai/sdk**: Claude AI API client
- **@playwright/test**: Browser automation
- **imap-simple**: Email verification
- **dotenv**: Environment variable management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational and legitimate automation purposes only.

## 🆘 Support

- **GitHub Issues**: Report bugs and feature requests
- **Stagehand Docs**: https://docs.stagehand.dev/
- **Claude AI**: https://www.anthropic.com/

---

**⚠️ Disclaimer**: This tool is intended for legitimate automation purposes only. Users are responsible for complying with Reddit's Terms of Service and applicable laws.
