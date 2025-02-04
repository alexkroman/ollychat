export const getQueries: string = `
User input: {input}
Metrics: {metricResults}
**Task:**  
Generate a list of PromQL queries that will provide a meaningful, data-informed response to the user's input.

---

### **Instructions:**  
1. **Understand the User's Question:**  
   - Summarize the user's input in a concise and clear manner.  
   - Identify the key information or insights the user is looking for.  

2. **Analyze the Provided Metrics:**  
   - The Metrics field contains a comma-separated list of metrics.  
   - For each metric, determine its relevance to answering the user's question.  
   - Consider whether aggregation, filtering, or time-based comparisons are necessary.  

3. **Generate PromQL Queries:**  
   - For each metric in the metrics list, generate a distinct PromQL query. 
   - Ensure each query retrieves meaningful data related to the user's input.  
   - Optimize queries for efficiency while maintaining accuracy.  
   - Include comments above each query explaining its purpose and how it contributes to answering the question.  

4. **Output Format:**  
   - **Summary of the User's Question** (1-2 sentences).  
   - **List of PromQL Queries**, each accompanied by a brief explanation.  

`;
