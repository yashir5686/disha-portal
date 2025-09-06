'use server';

/**
 * @fileOverview A personalized stream recommendation AI agent based on quiz results.
 *
 * - getPersonalizedStreamRecommendation - A function that handles the stream recommendation process.
 * - PersonalizedStreamRecommendationInput - The input type for the getPersonalizedStreamRecommendation function.
 * - PersonalizedStreamRecommendationOutput - The return type for the getPersonalizedStreamRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedStreamRecommendationInputSchema = z.object({
  quizResults: z
    .record(z.number())
    .describe(
      'A map of quiz question keys to the numerical score achieved by the user.  Higher is better.'
    ),
  profileInformation: z
    .string()
    .describe(
      'A summary of the users background, interests, aptitude and academic information'
    ),
});
export type PersonalizedStreamRecommendationInput = z.infer<
  typeof PersonalizedStreamRecommendationInputSchema
>;

const PersonalizedStreamRecommendationOutputSchema = z.object({
  streamRecommendation: z
    .string()
    .describe(
      'The recommended stream (Arts, Science, Commerce, or Vocational) based on the quiz results and profile information.'
    ),
  reasoning: z
    .string()
    .describe(
      'The detailed reasoning behind the stream recommendation, explaining how the quiz results and profile information led to this conclusion.'
    ),
});
export type PersonalizedStreamRecommendationOutput = z.infer<
  typeof PersonalizedStreamRecommendationOutputSchema
>;

export async function getPersonalizedStreamRecommendation(
  input: PersonalizedStreamRecommendationInput
): Promise<PersonalizedStreamRecommendationOutput> {
  return personalizedStreamRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedStreamRecommendationPrompt',
  input: {schema: PersonalizedStreamRecommendationInputSchema},
  output: {schema: PersonalizedStreamRecommendationOutputSchema},
  prompt: `You are an expert career counselor specializing in helping students choose the right academic stream.

Based on the student's quiz results and profile information, provide a personalized stream recommendation (Arts, Science, Commerce, or Vocational).
Explain your reasoning in detail, showing how the quiz results and profile information led to your recommendation.

Quiz Results: {{{quizResults}}}
Profile Information: {{{profileInformation}}}

Consider these factors:
* Interests expressed in the profile.
* Aptitude indicated by quiz results.
* Academic background described in the profile.
* Alignment of stream with potential career goals.

Ensure the recommendation is well-supported and provides actionable insights for the student.
`,
});

const personalizedStreamRecommendationFlow = ai.defineFlow(
  {
    name: 'personalizedStreamRecommendationFlow',
    inputSchema: PersonalizedStreamRecommendationInputSchema,
    outputSchema: PersonalizedStreamRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
