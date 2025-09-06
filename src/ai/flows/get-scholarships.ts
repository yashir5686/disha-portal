'use server';
/**
 * @fileOverview Fetches a list of scholarships.
 *
 * - getScholarships - A function that returns a list of scholarships.
 * - Scholarship - The type for a single scholarship.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ScholarshipSchema = z.object({
    name: z.string(),
    provider: z.string(),
    description: z.string(),
    eligibility: z.string(),
    link: z.string().url(),
    tags: z.array(z.string()),
    level: z.string(),
});

export type Scholarship = z.infer<typeof ScholarshipSchema>;

const GetScholarshipsInputSchema = z.object({
    query: z.string(),
});

const GetScholarshipsOutputSchema = z.object({
    scholarships: z.array(ScholarshipSchema),
});

export async function getScholarships(input: z.infer<typeof GetScholarshipsInputSchema>): Promise<z.infer<typeof GetScholarshipsOutputSchema>> {
    return getScholarshipsFlow(input);
}

const prompt = ai.definePrompt({
    name: 'getScholarshipsPrompt',
    input: { schema: GetScholarshipsInputSchema },
    output: { schema: GetScholarshipsOutputSchema },
    prompt: `You are an expert on Indian scholarships. Find a list of scholarships based on the following query: {{{query}}}. Return a list of 4-6 scholarships.`,
});

const getScholarshipsFlow = ai.defineFlow(
    {
        name: 'getScholarshipsFlow',
        inputSchema: GetScholarshipsInputSchema,
        outputSchema: GetScholarshipsOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
