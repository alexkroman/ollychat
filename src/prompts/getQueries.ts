export const getQueries: string = `
# Task: Generate and Explain PromQL Queries Based on User Input and Available Metrics

## Inputs
- **User Input:** \`{input}\`
- **Available Prometheus Metrics:** \`{metricResults}\`

## Objective
- **Summarize the Request:** Provide a concise, clear summary of the user's query.
- **Generate PromQL Queries:** Develop a list of valid and meaningful PromQL queries that address the user's request using the available metrics.
- **Explain Your Reasoning:** For each query, briefly explain the logic behind its construction to demonstrate how it addresses the user's input and leverages the provided metrics.

## Guidelines for Query Construction
- **Specificity:**  
  - Ensure queries return specific identifiers (e.g., instance names, service names, labels) whenever applicable.
- **List or Summary Requests:**  
  - When the user's request involves listing or summarizing items, format queries to return exact identifiers.
- **Filtering:**  
  - If the user specifies a server, instance, or label, incorporate these as filters in the relevant queries.
- **Relevance and Actionability:**  
  - Prioritize queries that yield actionable insights and directly answer the user's question.
- **Clarity:**  
  - Provide brief and clear explanations for each query to ensure transparency in your reasoning.

## Output Format
- **Summary:**  
  - Start with a short summary of the user's input.
- **Queries:**  
  - List the generated PromQL queries in a numbered format.
- **Explanations:**  
  - Under each query, include a brief explanation of the rationale behind it.
`;
