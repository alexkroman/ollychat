export const getQueries: string = `
User Input: {input}
Available Prometheus Metrics: {metricResults}

Task  
- Summarize the user's input in a concise and clear manner
- Generate a list of PromQL queries that will provide a meanmeaningful, data-informed response to the user's input.  
- Explain your reasoning before presenting the queries to ensure clarity and relevance.

Guidelines
- Construct queries that return specific identifiers (e.g., instance names, service names, or labels) whenever applicable.
- Consider that the user might be referring to the previous response when formulating the query.
- Detect if the user is requesting a list or summary of items and ensure the query format provides exact identifiers.
- If a user specifies a server, instance, or label, include it as a filter in all relevant queries.

`;
