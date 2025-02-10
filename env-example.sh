# Get an OpenAI API key here: https://platform.openai.com
# Provider options: openai, anthropic
# Model options: gpt-4o, gpt-4o-mini, claude-3-5-sonnet-20241022
PROVIDER=openai
MODEL_API_KEY=
MODEL=gpt-4o-mini

# This is a demo Prometheus server that I am paying for so you can quickly try out OllyChat without connecting to yours first
PROMETHEUS_URL=http://34.123.158.139:9090

# Get a Tavily API key here: https://app.tavily.com/ or leave it empty to disable the Tavily tool
TAVILY_API_KEY=

# Recommend leaving as is
GRAPH_RECURSION_LIMIT=5

# You can set LANGSMITH_TRACING to true to help me (alex) diagnose issues you are having with the app
LANGSMITH_TRACING=false
LANGCHAIN_VERBOSE=false
LANGSMITH_API_KEY=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
LANGSMITH_ENDPOINT="https://api.smith.langchain.com"
LANGSMITH_PROJECT="ollychat"

# Only needed for deploying Ollychat as a Slack bot
SLACK_BOT_TOKEN=
SLACK_SIGNING_SECRET=
SLACK_APP_TOKEN=
PORT=3000

# Sends basic telemetry to Posthog so I can improve the product - set to false to disable
TELEMETRY=true

# Only needed for deploying a demo instance of Prometheus for testing purposes
DEMO_EMAIL=
CLUSTER_NAME=ollychat-demo
REGION=us-central1

