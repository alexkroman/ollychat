export const getQueries: string = `
Generate a list of valid, meaningful PromQL queries based on:

User Input: {input}
Available Metrics: {metricResults}
Each query should:

Be specific, returning relevant identifiers (e.g., instances, services, labels).
Incorporate filters if the user specifies servers, instances, or labels.
Provide actionable insights or directly answer listing/summary requests with exact identifiers.
Output:

Return only plain-text PromQL queries (no additional formatting).
`;
