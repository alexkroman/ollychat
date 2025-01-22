export function normalizeQuestion(text: string): string {
    const stopWords = new Set([
        "a", "of", "the", "by", "for", "to", "in", "on", "per", "vs", "compared", "rate", "aggregated", "total", "sum", 
        "amount", "average", "current", "instantaneous", "normalized", "recent", "instant", "exported", "if", "second", 
        "or", "is", "an", "and", "as", "be", "from", "that", "this", "was", "with", "number", "active", "processed", 
        "consumed", "counted", "measured", "requests", "messages", "events", "samples", "operations", "records", 
        "attempts", "executed", "performed", "size", "duration", "time", "latency", "seconds", "milliseconds", 
        "nanoseconds", "successful", "failed", "pending", "utilization", "limit", "percentage", "percent", "bytes", 
        "value", "maximum", "minimum", "mean", "stddev", "over", "since", "each", "are"
    ]);

    return text
        .trim() // Remove extra spaces
        .toLowerCase() // Convert to lowercase
        .replace(/\s+/g, " ") // Replace multiple spaces with a single space
        .split(" ") // Split text into words
        .filter((word: string) => !stopWords.has(word)) // Remove stopwords
        .join(" ") // Join words back into a string
        .replace(/[^\w\s]/g, "") // Remove special characters (except spaces)
}