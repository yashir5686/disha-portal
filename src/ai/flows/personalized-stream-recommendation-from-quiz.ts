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
  quizResults: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })).describe('A list of questions and the user\'s answers.'),
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
  prompt: `You are an expert career counselor specializing in helping students in India choose the right academic stream after 10th or 12th grade.

Based on the student's quiz results and profile information, provide a personalized stream recommendation (Arts, Science, Commerce, or Vocational).
Explain your reasoning in detail, showing how the quiz results and profile information led to your recommendation.

Quiz Results:
{{#each quizResults}}
  Q: {{question}}
  A: {{answer}}
{{/each}}

Profile Information: {{{profileInformation}}}

Consider these factors:
* Interests expressed in the profile and revealed through quiz answers.
* Aptitude and personality traits indicated by quiz results.
* Academic background described in the profile.
* Alignment of stream with potential career goals mentioned.

Your reasoning should be encouraging and insightful. Analyze the patterns in the answers to identify the student's core interests (e.g., Realistic, Investigative, Artistic, Social, Enterprising, Conventional - RIASEC model), strengths, and personality.

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
