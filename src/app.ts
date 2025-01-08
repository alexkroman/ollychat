import { App } from '@slack/bolt';
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { PrometheusDriver }from 'prometheus-query';
import * as dotenv from 'dotenv';

// Initiatilize vector store


// https://demo.promlabs.com/api/v1/metadata



// Load environment variables from .env
dotenv.config();

// Initialize Bolt app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

const chat = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.7,
});

const prometheus = new PrometheusDriver({ endpoint: process.env.PROMETHEUS_URL || 'http://localhost:9090' });

const prompt = ChatPromptTemplate.fromMessages([
  {
    role: 'system',
    content: 'You are an expert in PromQL. Generate valid PromQL queries based on user input.',
  },
  {
    role: 'user',
    content: `Given the following input message, generate a valid PromQL query that represents its intent. Return only the PromQL query and nothing else:
Message: {messageText}
PromQL Query:`,
  },
]);

app.message(async ({ message, say }) => {
  try {
    const messageText = (message as { text: string }).text;
    console.log('Received a message event:', messageText);

    // Format the prompt
    const promptText = await prompt.format({ messageText });

    // Generate the PromQL query
    const promQLQuery = (await chat.invoke([{ role: 'user', content: promptText }])).content as string;

    // Send the PromQL query back
    await say(`Querying Prometheus with the Query: \`${promQLQuery}\``);
    
    try {
      // Perform the query
    let resultText = '';
    const result = await prometheus.instantQuery(promQLQuery).then((res) => {
      const series = res.result;
      series.forEach((serie) => {
          resultText += `Serie: \`${serie.metric.toString()}\` Time: \`${serie.value.time}\` Value: \`${serie.value.value}\``;
      });
      console.log('Result:', resultText);
      say(`Result: \`${resultText}\``);
    })

    } catch (error) {
      console.error('Error querying Prometheus:', error);
      await say(`Error querying Prometheus: \`${error}\``);

    }

  } catch (error: unknown) {
    console.error('An error occurred:', error);

    // Inform the user of the error
    await say('Sorry, I encountered an error while generating the PromQL query. Please try again later.');
  }
});

// Start your app
(async () => {
  const port = process.env.PORT || 3000;
  await app.start(port);
  console.log(`⚡️ Bolt app is running on port ${port}!`);
})();