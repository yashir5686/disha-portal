'use server';

/**
 * @fileOverview Fetches a list of colleges based on a query.
 * 
 * - getColleges - A function that returns a list of colleges.
 * - College - The type for a single college.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CollegeSchema = z.object({
  name: z.string().describe('The name of the college.'),
  state: z.string().describe('The state where the college is located.'),
  district: z.string().describe('The district where the college is located.'),
  programs: z.array(z.string()).describe('A list of popular programs offered.'),
  website: z.string().url().describe('The official website of the college.'),
});
export type College = z.infer<typeof CollegeSchema>;

const GetCollegesInputSchema = z.object({
  query: z.string().describe('A query to search for colleges.'),
});

const GetCollegesOutputSchema = z.object({
  colleges: z.array(CollegeSchema),
});

export async function getColleges(input: z.infer<typeof GetCollegesInputSchema>): Promise<z.infer<typeof GetCollegesOutputSchema>> {
  return getCollegesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getCollegesPrompt',
  input: { schema: GetCollegesInputSchema },
  output: { schema: GetCollegesOutputSchema },
  prompt: `You are an expert in Indian education. Find a list of colleges based on the following query: {{{query}}}. Return a list of 5-10 colleges.`,
});

const getCollegesFlow = ai.defineFlow(
  {
    name: 'getCollegesFlow',
    inputSchema: GetCollegesInputSchema,
    outputSchema: GetCollegesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
