import slack from '@slack/bolt';
const { App } = slack;
import { answerQuestion  } from "./ollychat.js";

// Initialize Bolt app
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true,
  });
  
  app.event('app_mention', async ({ event, say }) => {
    try {
      const messageText = (event as { text: string }).text;
      console.log('Received a message event:', messageText); 
      const results = await answerQuestion( { question: messageText });
      await say(results.query);
  
    } catch (error: unknown) {
      console.error('An error occurred:', error);
      await say('Sorry, I encountered an error while generating the PromQL query. Please try again later.');
    }
  });
  
  // Start your app
  (async () => {
    const port = process.env.PORT || 3000;
    await app.start(port);
    console.log(`⚡️ Bolt app is running on port ${port}!`);
  })();