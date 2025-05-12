import { Stagehand, Page, BrowserContext } from "@browserbasehq/stagehand";
import StagehandConfig from "./stagehand.config.js";
import chalk from "chalk";
import boxen from "boxen";
import * as fs from 'fs';
import * as path from 'path';

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
  const filePath = path.join(__dirname, '../RedditAccountCreator/config/email_pass_list.txt');
  const data = fs.readFileSync(filePath, 'utf8');
  return data.split('\n').map(line => {
    const [email, password] = line.split(':');
    return { email, password };
  }).filter(cred => cred.email && cred.password);
};

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
    await page.act('fill in email field with ' + cred.email);
    await page.act('fill in password field with ' + cred.password);
    await page.act('click on continue or sign up button');
    
    // Add a delay to avoid rate limiting
    await page.waitForTimeout(5000);
  }

  console.log('Account creation process completed.');
  await stagehandInstance.close();
})();

run();
