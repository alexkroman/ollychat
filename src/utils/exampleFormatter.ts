import { loadPromptFromFile } from '../utils/promptLoader.js';

export const formatExamples = async (examples: any[], promptPath: string, keys: string[]) => {
    const prompt = loadPromptFromFile(promptPath);
    const formattedExamples = await Promise.all(
        examples.map(example =>
            prompt.format(
                keys.reduce((acc: { [key: string]: any }, key) => {
                    acc[key] = example.metadata[key];
                    return acc;
                }, {})
            )
        )
    );
    return formattedExamples.join('\n');
};