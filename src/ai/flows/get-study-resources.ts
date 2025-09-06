'use server';
/**
 * @fileOverview Fetches a list of study resources.
 *
 * - getStudyResources - A function that returns a list of study resources.
 * - StudyResource - The type for a single study resource.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const StudyResourceSchema = z.object({
    title: z.string(),
    platform: z.string(),
    description: z.string(),
    link: z.string().url(),
    imageUrl: z.string().url().describe("use picsum.photos for placeholder images"),
});

export type StudyResource = z.infer<typeof StudyResourceSchema>;

const GetStudyResourcesInputSchema = z.object({
    query: z.string(),
});

const GetStudyResourcesOutputSchema = z.object({
    resources: z.array(StudyResourceSchema),
});

export async function getStudyResources(input: z.infer<typeof GetStudyResourcesInputSchema>): Promise<z.infer<typeof GetStudyResourcesOutputSchema>> {
    return getStudyResourcesFlow(input);
}

const prompt = ai.definePrompt({
    name: 'getStudyResourcesPrompt',
    input: { schema: GetStudyResourcesInputSchema },
    output: { schema: GetStudyResourcesOutputSchema },
    prompt: `You are an expert on Indian educational resources. Find a list of study resources based on the following query: {{{query}}}. Return a list of 4 resources. Use https://picsum.photos/400/225 for image urls.`,
});

const getStudyResourcesFlow = ai.defineFlow(
    {
        name: 'getStudyResourcesFlow',
        inputSchema: GetStudyResourcesInputSchema,
        outputSchema: GetStudyResourcesOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
