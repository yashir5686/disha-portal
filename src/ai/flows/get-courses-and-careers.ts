'use server';
/**
 * @fileOverview Fetches course and career data.
 *
 * - getCoursesAndCareers - A function that returns course and career data.
 * - CourseToCareer - The return type for the getCoursesAndCareers function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DegreeSchema = z.object({
    name: z.string(),
    description: z.string(),
    subjects: z.array(z.string()),
    careerPaths: z.array(z.string()),
    higherEducation: z.string(),
});

const StreamSchema = z.object({
    streamName: z.string(),
    degrees: z.array(DegreeSchema),
});

const CourseToCareerDataSchema = z.object({
    streams: z.array(StreamSchema),
});

export type CourseToCareer = z.infer<typeof CourseToCareerDataSchema>;

export async function getCoursesAndCareers(input: { query: string }): Promise<CourseToCareer> {
    return courseToCareerFlow(input);
}

const prompt = ai.definePrompt({
    name: 'courseToCareerPrompt',
    input: { schema: z.object({ query: z.string() }) },
    output: { schema: CourseToCareerDataSchema },
    prompt: `You are an expert in Indian education. Provide a list of popular streams and degrees based on the query: {{{query}}}. Return 2-3 streams with 2 degrees each.`,
});

const courseToCareerFlow = ai.defineFlow(
    {
        name: 'courseToCareerFlow',
        inputSchema: z.object({ query: z.string() }),
        outputSchema: CourseToCareerDataSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
