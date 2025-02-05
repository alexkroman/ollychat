import slack from "@slack/bolt";
import slackifyMarkdown from "slackify-markdown";
import { answerQuestion } from "../ollychat.js";
import { config } from "../config/slackConfig.js";

const { App } = slack;

const app = new App({
  token: config.slackBotToken,
  signingSecret: config.slackSigningSecret,
  appToken: config.slackAppToken,
  socketMode: true,
});

app.event("app_mention", async ({ event, say }) => {
  try {
    const messageText = event.text;
    const userId = event.user;
    const result = await answerQuestion({ question: messageText });
    const response = `<@${userId}> ${slackifyMarkdown(String(result))}`;

    await say({
      text: response,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: response,
          },
        },
      ],
    });
  } catch (error) {
    console.error("An error occurred:", error);
    await say(
      "Sorry, I encountered an error while generating the PromQL query. Please try again later.",
    );
  }
});

const main = async () => {
  try {
    await app.start(config.port);
    console.log(`⚡️ Slack app is running on port ${config.port}!`);
  } catch (error) {
    console.error("Failed to start Slack app", error);
    process.exit(1);
  }
};

main();
