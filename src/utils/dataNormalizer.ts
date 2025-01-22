export function normalizeQuestion(text: string): string {
    const stopWords = new Set([
        "a", "of", "the", "by", "for", "to", "in", "on", "with", "per", "vs", "compared to",
        "rate", "aggregated", "total", "sum", "amount", "average", "current", "instantaneous", "normalized",
        "recent","instant","exported", "if", "second", "or", "is","in",
        "a", "an", "and", "as", "be", "by", "for", "from", "in", "of", "on", "that", "the", "this", "to", "was", "with",
        "number", "total", "current", "active", "aggregated", "processed", "consumed", "counted", "measured", "requests",
        "messages", "events", "samples", "operations", "records", "attempts", "executed", "performed", "rate", "size",
        "amount", "duration", "time", "latency", "seconds", "milliseconds", "nanoseconds", "successful", "failed", "pending",
        "utilization", "limit", "percentage", "percent", "bytes", "records", "value", "maximum", "minimum", "average",
        "mean", "stddev", "over", "since", "per", "each", "are"
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