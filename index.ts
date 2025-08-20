import { Stagehand, Page, BrowserContext } from "@browserbasehq/stagehand";
import StagehandConfig from "./stagehand.config.js";
import chalk from "chalk";
import boxen from "boxen";
import * as fs from 'fs';
import * as path from 'path';
import imap from 'imap-simple';

/**
 * 🤘 Welcome to Stagehand! Thanks so much for trying us out!
 * 🛠️ CONFIGURATION: stagehand.config.ts will help you configure Stagehand
 *
 * 📝 Check out our docs for more fun use cases, like building agents
 * https://docs.stagehand.dev/
 *
 * 💬 If you have any feedback, reach out to us on Slack!
 * https://stagehand.dev/slack
 *
 * 📚 You might also benefit from the docs for Zod, Browserbase, and Playwright:
 * - https://zod.dev/
 * - https://docs.browserbase.com/
 * - https://playwright.dev/docs/intro
 */
async function main({
  page,
  context,
  stagehand,
}: {
  page: Page; // Playwright Page with act, extract, and observe methods
  context: BrowserContext; // Playwright BrowserContext
  stagehand: Stagehand; // Stagehand instance
}) {
  /**
   * 📝 Your code here!
   */
}

/**
 * This is the main function that runs when you do npm run start
 *
 * YOU PROBABLY DON'T NEED TO MODIFY ANYTHING BELOW THIS POINT!
 *
 */
async function run() {
  const stagehand = new Stagehand({
    ...StagehandConfig,
  });
  await stagehand.init();

  if (StagehandConfig.env === "BROWSERBASE" && stagehand.browserbaseSessionID) {
    console.log(
      boxen(
        `View this session live in your browser: \n${chalk.blue(
          `https://browserbase.com/sessions/${stagehand.browserbaseSessionID}`,
        )}`,
        {
          title: "Browserbase",
          padding: 1,
          margin: 3,
        },
      ),
    );
  }

  const page = stagehand.page;
  const context = stagehand.context;
  await main({
    page,
    context,
    stagehand,
  });
  await stagehand.close();
  stagehand.log({
    category: "create-browser-app",
    message: `\n🤘 Thanks so much for using Stagehand! Reach out to us on Slack if you have any feedback: ${chalk.blue(
      "https://stagehand.dev/slack",
    )}\n`,
  });
}

// Function to read email and password list
const readCredentials = () => {
  const filePath = new URL('file://' + process.cwd() + '/config/email_pass_list.txt').pathname;
  const data = fs.readFileSync(filePath, 'utf8');
  return data.split('\n').map(line => {
    const [email, password] = line.split(':');
    return { email, password };
  }).filter(cred => cred.email && cred.password);
};

async function getVerificationCode(email: string, password: string) {
  const config = {
    imap: {
      user: email,
      password: password,
      host: 'imap.gmx.com',
      port: 993,
      tls: true,
      authTimeout: 3000
    }
  };
  try {
    const connection = await imap.connect(config);
    await connection.openBox('INBOX');
    const searchCriteria = ['UNSEEN', ['FROM', 'reddit']];
    const fetchOptions = { bodies: ['TEXT'], markSeen: true };
    const messages = await connection.search(searchCriteria, fetchOptions);
    let code = null;
    for (const message of messages) {
      const part = message.parts.find((part: any) => part.which === 'TEXT');
      const text = part ? part.body : '';
      const match = text.match(/\d{6}/);
      if (match) {
        code = match[0];
        break;
      }
    }
    connection.end();
    return code;
  } catch (error) {
    console.error('Error fetching email:', error);
    return null;
  }
}

(async () => {
  const stagehandInstance = new Stagehand({
    ...StagehandConfig,
  });
  await stagehandInstance.init();
  const page = stagehandInstance.page;
  const credentials = readCredentials();

  for (const cred of credentials) {
    console.log(`Creating account for ${cred.email}`);
    await page.goto('https://www.reddit.com/register/');
    
    // Use act() to fill in the registration form
    const emailField = page.locator('input[type="email"][name="email"]');
    await emailField.fill(cred.email);
    await page.act('fill in password field with ' + cred.password);
    await page.act('click on continue or sign up button');
    
    // Wait for email verification field
    console.log('Waiting for verification code field...');
    await page.waitForSelector('input[name="verificationCode"]', { timeout: 60000 });
    console.log('Verification code field found, attempting to retrieve code...');
    const verificationCode = await getVerificationCode(cred.email, cred.password);
    if (verificationCode) {
      console.log('Verification code retrieved: ' + verificationCode);
      const codeField = page.locator('input[name="verificationCode"]');
      await codeField.fill(verificationCode);
      console.log('Verification code entered, submitting...');
      await page.act('submit verification code');
      console.log('Verification code submitted.');
    } else {
      console.error('Could not retrieve verification code for ' + cred.email);
    }
    
    // Add a delay to avoid rate limiting
    await page.waitForTimeout(5000);
  }

  console.log('Account creation process completed.');
  await stagehandInstance.close();
})();

run();
