
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

export type Grade = '10th' | '12th';

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
  grade: z.enum(['10th', '12th']).describe("The user's current grade level."),
  stream: z.string().optional().describe('The student\'s stream if they are in 12th grade (e.g., Science, Commerce, Arts).'),
});
export type PersonalizedStreamRecommendationInput = z.infer<
  typeof PersonalizedStreamRecommendationInputSchema
>;

const PersonalizedStreamRecommendationOutputSchema = z.object({
  recommendationTitle: z.string().describe("A short, catchy title for the recommendation section, e.g., 'Recommended Stream' or 'Recommended Career Path'."),
  recommendation: z
    .string()
    .describe(
      'The recommended stream (for 10th grade) or a specific degree/career field (for 12th grade).'
    ),
  reasoning: z
    .string()
    .describe(
      'The detailed reasoning behind the recommendation, explaining how the quiz results and profile information led to this conclusion. This should include suggestions for future courses, degrees, and job potential.'
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
  prompt: `You are an expert career counselor in India. Your task is to provide a personalized recommendation based on a student's grade, quiz results, and profile.

Student Grade: {{{grade}}}
{{#if stream}}Student's 12th Grade Stream: {{{stream}}}{{/if}}

Quiz Results:
{{#each quizResults}}
  Q: {{question}}
  A: {{answer}}
{{/each}}

Profile Information: {{{profileInformation}}}

**Your Task:**

Based on all the provided information, generate a personalized recommendation. Analyze the patterns in the answers to identify the student's core interests (e.g., using the RIASEC model implicitly), strengths, and personality.

{{#if (eq grade '10th')}}
  **For a 10th Grade Student:**
  1.  **`recommendationTitle`**: Set this to "Recommended Stream".
  2.  **`recommendation`**: Recommend the most suitable stream for 11th/12th grade (Science, Commerce, Arts, or Vocational).
  3.  **`reasoning`**:
      *   Provide a detailed explanation for why this stream is recommended, linking back to their quiz answers and profile.
      *   Suggest 2-3 potential degree paths they could pursue after 12th in this stream (e.g., B.Tech, B.Com, B.A. in Psychology).
      *   Mention 2-3 exciting future job roles related to those degrees (e.g., Software Engineer, Chartered Accountant, Clinical Psychologist).
{{else}}
  **For a 12th Grade Student from the {{{stream}}} stream:**
  1.  **`recommendationTitle`**: Set this to "Recommended Career Path".
  2.  **`recommendation`**: Suggest a specific and suitable degree or course to pursue after 12th grade (e.g., "Bachelor of Technology in AI & ML", "Chartered Accountancy (CA)", "B.A. in Journalism & Mass Communication").
  3.  **`reasoning`**:
      *   Provide a detailed explanation for your recommendation, connecting it to their chosen stream, quiz answers, and profile information.
      *   Describe the future potential of this career path, including job prospects and growth opportunities in the Indian market.
      *   Suggest 1-2 related higher education options or specializations they could consider later.
{{/if}}

Your reasoning should be encouraging, insightful, and provide actionable advice.
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
