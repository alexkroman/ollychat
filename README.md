# Install Chroma

- docker pull chromadb/chroma
- docker run -p 8000:8000 chromadb/chroma

# Set up CLI

- mv config/env-example.example to .env
- Edit .env with your values

# Start CLI

- npm run start:cli

# Set up a Slack bot (optional)

- Add SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, and SLACK_APP_TOKEN to .env
- Add a Slack App using the config/slack-manifest.json file