![ OllyChat](https://raw.githubusercontent.com/alexkroman/ollychat/refs/heads/main/public/ollychat.jpeg)

OllyChat allows you to create custom DevOps AI agents to better understand and manage your infrastructure.

You can try OllyChat without any observability data by pointing your config at our demo Prometheus server: <http://34.123.158.139:9090>

## ✨ Features

- [Chat with your observability data](DEMO.md)
- [Build your own DevOps AI Agent](#building-your-own-devops-ai-agent-with-ollychat)

## 🖥️ OllyChat in CLI

![CLI Demo](https://raw.githubusercontent.com/alexkroman/ollychat/refs/heads/main/public/cli-demo-2.gif)

## 💬 OllyChat in Slack

![Slack Demo](https://github.com/alexkroman/ollychat/blob/main/public/slack-demo.gif?raw=true)

## 📊 Supported Observability Platforms

- Prometheus
- New Relic (coming soon)
- DataDog (coming soon)
- Elastic (coming soon)

## 🧠 Supported LLM's

- OpenAI
- Anthropic
- [Ollama (tool supporting)](https://ollama.com/search?c=tools)

## 🚀 Getting Started Without Docker

### Prerequisites

- node.js
- npm

### Install

```bash
# Clone the repository
git clone https://github.com/alexkroman/ollychat.git

cd ollychat

# Install dependencies
npm install
```

### Set Your Environment Variables

```bash
cp env-example.sh .env
Edit `.env` with your settings
```

### Running the CLI

```bash
# Start the CLI
npm run cli:start
```

### Installing Optional Slack Integration

1. Create a Slack App:
   - Visit [Slack API](https://api.slack.com/apps)
   - Click "Create New App" → "From an app manifest"
   - Select your workspace
   - Copy JSON in `deploy/slack/slack-manifest.json`

2. Install the app to your workspace:
   - Navigate to "Install App" in your Slack App settings
   - Click "Install to Workspace"
   - Grant requested permissions

3. Start the Slack bot:
  
```bash
# Start the Slack backend
npm run slack:start
```

### Using OllyChat in Slack

Invite @olly to your team or incident channel.

- @olly what's the health status of my cluster?
- @olly any alerts?
- @olly which pods are consuming the most memory?

## Getting Started With Docker

You can use Docker to deploy both the Slack app and CLI app

### Set Your Docker Environment Variables

```bash
cp env-example.sh .env
# Edit .env with your settings
```

### Build the Container

```bash
# Build the docker container
npm run docker:build
```

### Run the CLI

```bash
# Build the docker container
npm run docker:run:cli
```

### Run the Slack App

```bash
# Build the docker container
npm run docker:run:slack
```

## ❤️ Contributing

- Submit a [feature request](https://github.com/alexkroman/ollychat/issues/new) or [bug report](https://github.com/alexkroman/ollychat/issues/new)

### Building your own DevOps AI Agent with OllyChat

- You can use src/tools/prometheus.ts as a template to get started

```bash
# Use prometheus agent as a template
cp src/tools/prometheus.ts src/tools/newTool.ts
```

- Add your tool as an import and to the tools array in src/tools/index.ts

### Run Tests

```bash
npm test
```

### Run Linter

```bash
npm run lint
```

### Generate Evaluation Run

When you make changes to the app you should generate an evaluation run to test your change against ground truths.

```bash
# Load the latest version of the evaluation data
npm run evals:load

# Run the evaluations
npm run evals:start
```

## 📜 License

Ollychat is MIT licensed. See [LICENSE](LICENSE) for details.
