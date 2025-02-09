import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { config } from "../config/config.js";

export const searchTool = config.tavilyEnabled
  ? new TavilySearchResults({
      maxResults: 1,
      apiKey: config.tavilyApiKey ?? "",
    })
  : null;
