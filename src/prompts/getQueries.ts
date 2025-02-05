export const getQueries: string = `
# Task: Generate PromQL Queries Based on User Input and Available Metrics

## Inputs:
- **User Input:** {input}
- **Available Prometheus Metrics:** {metricResults}

## Objective:
1. **Summarize the User's Input:** Provide a concise and clear summary of the user's request or question.
2. **Generate PromQL Queries:** Create a list of meaningful PromQL queries that directly address the user's input using the available metrics.
3. **Explain Your Reasoning:** Before presenting the queries, explain the logic behind them to ensure clarity and relevance.

## Guidelines for Query Construction:
- **Specificity:** Ensure queries return specific identifiers (e.g., instance names, service names, or labels) whenever applicable.
- **List or Summary Requests:** If the user is asking for a list or summary of items, format the queries to return exact identifiers.
- **Filters:** If the user specifies a server, instance, or label, include it as a filter in all relevant queries.
- **Relevance:** Prioritize queries that provide actionable insights or directly answer the user's question.

`;
