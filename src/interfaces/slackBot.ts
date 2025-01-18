import slack from '@slack/bolt';
const { App } = slack;
import { answerQuestion } from "../agents/ollychat.js";
import { config } from "../config/config.js";

const app = new App({
  token: config.slackBotToken,
  signingSecret: config.slackSigningSecret,
  appToken: config.slackAppToken,
  socketMode: true,
});

app.event('app_mention', async ({ event, say }) => {
  try {
    const messageText = (event as { text: string }).text;
    const results = await answerQuestion({ question: messageText });
    await say(results.query);

  } catch (error: unknown) {
    console.error('An error occurred:', error);
    await say('Sorry, I encountered an error while generating the PromQL query. Please try again later.');
  }
});

(async () => {
  await app.start(config.port);
  console.log(`⚡️ Bolt app is running on port ${config.port}!`);
})();