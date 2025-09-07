
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

const InterestAreaSchema = z.object({
  area: z.string().describe("The name of the interest area (e.g., 'Artistic', 'Investigative')."),
  score: z.number().min(0).max(100).describe("The student's score for this area, from 0 to 100."),
  summary: z.string().describe("A brief summary of what this interest area means for the student."),
});

const CollegeRecommendationSchema = z.object({
  name: z.string().describe("The name of the recommended college."),
  location: z.string().describe("The city and state of the college."),
  entranceExam: z.string().describe("The primary entrance exam required for admission (e.g., 'JEE Main', 'NEET', 'CUET')."),
});

const DegreeInfoSchema = z.object({
  name: z.string().describe("The name of the degree or course."),
  description: z.string().describe("A brief description of the course."),
  careerOptions: z.object({
    privateJobs: z.array(z.string()).describe("List of potential private sector job roles."),
    govtJobs: z.array(z.string()).describe("List of potential government sector job roles or exams."),
    higherEducation: z.array(z.string()).describe("Options for further studies."),
    entrepreneurship: z.array(z.string()).describe("Potential entrepreneurial opportunities."),
  }),
});

const RecommendationSchema = z.object({
  recommendationTitle: z.string().describe("A short, catchy title for the recommendation section, e.g., 'Recommended Stream for You' or 'Your Recommended Career Path'."),
  recommendation: z
    .string()
    .describe(
      'The primary recommended stream (for 10th grade) or a specific degree/career field (for 12th grade).'
    ),
  reasoning: z
    .string()
    .describe(
      'A detailed summary explaining how the quiz results and profile information led to this conclusion. This should be a narrative summary.'
    ),
  interestAnalysis: z.array(InterestAreaSchema).describe("An analysis of the student's interests based on the quiz, mapped to 3-4 core areas (like RIASEC)."),
  degreeOptions: z.array(DegreeInfoSchema).describe("A list of 2-3 detailed degree/course options aligned with the recommendation."),
  collegeSuggestions: z.array(CollegeRecommendationSchema).describe("A list of 3-4 government colleges suitable for the recommended path."),
  alternativeRecommendations: z.array(z.string()).describe("A list of 2-3 alternative career paths or streams for the student to consider."),
});


export type PersonalizedStreamRecommendationOutput = z.infer<typeof RecommendationSchema>;

export async function getPersonalizedStreamRecommendation(
  input: PersonalizedStreamRecommendationInput
): Promise<PersonalizedStreamRecommendationOutput> {
  return personalizedStreamRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedStreamRecommendationPrompt',
  input: {schema: PersonalizedStreamRecommendationInputSchema},
  output: {schema: RecommendationSchema},
  prompt: `You are an expert career counselor in India. Your task is to provide a detailed, actionable, and personalized recommendation based on a student's grade, quiz results, and profile.

Student Grade: {{{grade}}}

Quiz Results:
{{#each quizResults}}
  Q: {{question}}
  A: {{answer}}
{{/each}}

Profile Information: {{{profileInformation}}}

**Your Task:**

Based on all the provided information, generate a comprehensive and personalized recommendation report.

1.  **Analyze Interests**: First, analyze the quiz answers to identify the student's core interests. Map them to 3-4 interest areas (using a framework like RIASEC: Realistic, Investigative, Artistic, Social, Enterprising, Conventional, but simplified). For each area, provide a score (0-100) and a brief summary. This will form the \`interestAnalysis\`.

2.  **Main Recommendation**:
    *   If the student is in **10th Grade**: Recommend the most suitable stream (Science, Commerce, Arts, or Vocational).
    *   If the student is in **12th Grade** (stream: {{{stream}}}): Suggest a specific and suitable career field or broad degree category (e.g., "AI & Machine Learning", "Corporate Finance", "Digital Media").
    *   Set the \`recommendationTitle\` and \`recommendation\` fields accordingly.

3.  **Reasoning**: Provide a narrative summary in the \`reasoning\` field. Explain *why* this recommendation is a good fit, connecting their interest analysis, quiz answers, and profile information in a cohesive story.

4.  **Degree Options**: Suggest 2-3 specific degree/course options (\`degreeOptions\`) that align with the main recommendation. For each degree:
    *   Provide a brief description.
    *   List career options across private jobs, government jobs/exams, higher education paths, and entrepreneurship ideas.

5.  **College Suggestions**: Recommend 3-4 well-known government colleges (\`collegeSuggestions\`) in India that are excellent for the recommended path. Include the college name, location (city, state), and the main entrance exam needed.

6.  **Alternative Paths**: To provide a broader perspective, list 2-3 \`alternativeRecommendations\`. These should be viable backup options or related fields the student might also find interesting.

Your tone should be encouraging, insightful, and provide clear, actionable advice for the Indian context.
`,
});

const personalizedStreamRecommendationFlow = ai.defineFlow(
  {
    name: 'personalizedStreamRecommendationFlow',
    inputSchema: PersonalizedStreamRecommendationInputSchema,
    outputSchema: RecommendationSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
