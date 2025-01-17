export function normalizeQuestion(text: string): string {
    return text
        .trim() // Remove extra spaces
        .toLowerCase() // Convert to lowercase
        .replace(/\s+/g, " ") // Replace multiple spaces with a single space
        .replace(/[^\w\s]/g, "") // Remove special characters (except spaces)
}