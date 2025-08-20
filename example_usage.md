# 🚀 Quick Usage Example

## 1. Setup Your Environment

```bash
# Navigate to the project directory
cd RedditAccountCreatorStagehand/acccreator

# Install dependencies
npm install

# Set up your Claude API key
echo "ANTHROPIC_API_KEY=your_actual_api_key_here" > .env
```

## 2. Configure Email Accounts

Edit `config/email_pass_list.txt`:
```
your_email1@gmx.com:your_password1
your_email2@gmx.com:your_password2
your_email3@gmx.com:your_password3
```

## 3. Run the Bot

```bash
# Start the account creation process
npm start
```

## 4. What Happens Next

The bot will:
1. Open a browser window
2. Navigate to Reddit registration
3. Fill in each email/password pair
4. Wait for verification codes
5. Retrieve codes from GMX emails
6. Complete account creation
7. Move to the next account

## 5. Monitor Progress

Watch the console output for:
- Account creation progress
- Verification code retrieval
- Any errors or issues
- Completion status

## ⚠️ Important Notes

- **Use Real GMX Accounts**: The bot needs real email accounts to work
- **Respect Rate Limits**: The bot includes delays to avoid detection
- **Monitor the Process**: Keep an eye on the browser and console
- **Stop if Needed**: Use Ctrl+C to stop the process at any time

## 🔧 Customization

You can modify:
- `stagehand.config.ts` - AI model and browser settings
- `index.ts` - Bot behavior and timing
- `config/email_pass_list.txt` - Account list
- `.env` - API keys and environment variables

## 🆘 Need Help?

- Check the main README.md for detailed documentation
- Review the console output for error messages
- Ensure all dependencies are installed
- Verify your Claude API key is working
