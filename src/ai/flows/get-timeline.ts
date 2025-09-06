'use server';
/**
 * @fileOverview Fetches a timeline of educational events.
 *
 * - getTimeline - A function that returns a timeline of events.
 * - TimelineEvent - The type for a single timeline event.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TimelineEventSchema = z.object({
    title: z.string(),
    date: z.string().describe('in YYYY-MM-DD format'),
    type: z.enum(['Exam', 'Admission', 'Scholarship', 'Other']),
});
export type TimelineEvent = z.infer<typeof TimelineEventSchema>;

const GetTimelineInputSchema = z.object({
    query: z.string(),
});

const GetTimelineOutputSchema = z.object({
    events: z.array(TimelineEventSchema),
});

export async function getTimeline(input: z.infer<typeof GetTimelineInputSchema>): Promise<z.infer<typeof GetTimelineOutputSchema>> {
    return getTimelineFlow(input);
}

const prompt = ai.definePrompt({
    name: 'getTimelinePrompt',
    input: { schema: GetTimelineInputSchema },
    output: { schema: GetTimelineOutputSchema },
    prompt: `You are an expert on the Indian education timeline. Find a list of upcoming events based on the following query: {{{query}}}. Return a list of 4-6 events.`,
});

const getTimelineFlow = ai.defineFlow(
    {
        name: 'getTimelineFlow',
        inputSchema: GetTimelineInputSchema,
        outputSchema: GetTimelineOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
