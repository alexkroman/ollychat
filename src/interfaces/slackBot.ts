import slack from '@slack/bolt';
import { answerQuestion } from "../agents/ollychat.js";
import { slackConfig } from "../config/slackConfig.js";

const { App } = slack;

const app = new App({
  token: slackConfig.slackBotToken,
  signingSecret: slackConfig.slackSigningSecret,
  appToken: slackConfig.slackAppToken,
  socketMode: true,
});

app.event('app_mention', async ({ event, say }) => {
  try {
    const messageText = event.text;
    const results = await answerQuestion({ question: messageText });

    await say({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `🔍 *Query:*\n\`\`\`${results.query}\`\`\`\n✅ *Answer:*\n\`\`\`${results.answer}\`\`\``
          }
        }
      ]
    });

  } catch (error) {
    console.error('An error occurred:', error);
    await say('Sorry, I encountered an error while generating the PromQL query. Please try again later.');
  }
});

const main = async () => {
  try {
    await app.start(slackConfig.port);
    console.log(`⚡️ Slack app is running on port ${slackConfig.port}!`);
  } catch (error) {
      console.error('Failed to start Slack app', error);
      process.exit(1);
  }
};

main();