# OllyChat

Ollychat allows you to chat with your observability data. Ask questions in plain English and get instant insights, whether through the CLI or Slack.

# CLI Demo

![CLI Demo](https://raw.githubusercontent.com/alexkroman/ollychat/refs/heads/main/public/cli-demo-2.gif)

# Slack Demo



## 🌟 Key Features

- Natural language processing of metrics queries
- Intelligent query translation to PromQL
- Seamless Slack integration for team collaboration

## 🚀 Quick Start

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher
- Slack workspace (optional, for Slack integration)

### Installation

```bash
# Clone the repository
git clone https://github.com/alexkroman/ollychat.git
cd ollychat

# Install dependencies
npm install

# Set up configuration
cp example.env .env
```

### Configuration

Edit `.env` with your settings

### Usage

#### CLI Mode

```bash
# Start the CLI
npm run cli:start

# Example queries
> what's the health status of my cluster?
> any alerts?
> which pods are consuming the most memory?
```

### Slack Integration

1. Create a Slack App:
   - Visit [Slack API](https://api.slack.com/apps)
   - Click "Create New App" → "From an app manifest"
   - Select your workspace
   - Copy content from `config/slack-manifest.json`

2. Install the app to your workspace:
   - Navigate to "Install App" in your Slack App settings
   - Click "Install to Workspace"
   - Grant requested permissions

3. Start the Slack bot:
  
   ```bash
   npm run slack:start
   ```

## Run tests

```bash
npm test
```

## Run linter

```bash
npm run lint
```

## 📄 License

Ollychat is MIT licensed. See [LICENSE](LICENSE) for details.
