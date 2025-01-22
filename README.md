# Ollychat

## Overview

Ollychat is an open-source tool that allows you to interact with your observability data through natural language queries. It supports querying Prometheus and can be used as a CLI tool or integrated as a Slack bot for team collaboration.

## Features

- **Natural Language Queries:** Ask questions and receive results from Prometheus.
- **Multi-Mode Operation:** Run as a command-line interface (CLI) or a Slack bot.
- **ChromaDB Integration:** Uses ChromaDB for efficient data storage and retrieval.
- **Configurable & Extendable:** Easily configurable via environment variables.

## Quickstart

### Prerequisites

- [Docker](https://www.docker.com/) installed and running
- [Node.js](https://nodejs.org/) (latest LTS version recommended)
- Slack workspace (if using Slack integration)

### Install ChromaDB

ChromaDB is used for embedding storage. To install and run it using pip:

```sh
pip install chromadb 
```

### Set Up the CLI

1. Copy the example environment configuration:

   ```sh
   mv config/env-example.example .env
   ```

2. Edit the `.env` file with your specific values (such as Prometheus URL, authentication tokens, etc.).

### Start the CLI

Run the following command to start the CLI mode:

```sh
npm run start:cli
```

### Set Up a Slack Bot (Optional)

To integrate Ollychat with Slack, follow these steps:

1. Add the following credentials to your .env file:

   ```sh
   SLACK_BOT_TOKEN=<your-slack-bot-token>
   SLACK_SIGNING_SECRET=<your-slack-signing-secret>
   SLACK_APP_TOKEN=<your-slack-app-token>
   ```

2. Create a Slack App in your workspace:
   - Use the provided manifest file located at `config/slack-manifest.json`.
   - Go to [Slack API](https://api.slack.com/apps) and create a new app.
   - Import the manifest to configure the bot.
   - Install the app in your workspace and add it to a channel.

## Configuration

Ollychat requires environment variables to function properly. Below are some key configurations:

- **PROMETHEUS_URL**: The URL of your Prometheus server.
- **CHROMA_DB_HOST**: The host URL for ChromaDB.
- **SLACK_BOT_TOKEN**: Authentication token for Slack integration.
- **SLACK_SIGNING_SECRET**: Secret for verifying Slack requests.

## Development

### Running Locally

For development purposes, you can run Ollychat locally with the following steps:

```sh
npm run dev:cli
```

### Contributing

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Open a pull request with a detailed description of changes.

## License

Ollychat is open-source software licensed under the MIT License.

## Contact

For issues, feature requests, or discussions, open an issue on GitHub.
