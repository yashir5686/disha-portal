'use server';
/**
 * @fileOverview Fetches details for a specific competitive exam.
 *
 * - getExamDetails - A function that returns details for an exam.
 * - ExamDetails - The return type for the getExamDetails function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExamDetailsSchema = z.object({
    syllabus: z.string().describe("A concise summary of the main subjects and topics covered in the exam."),
    cutoff: z.string().describe("A general overview of the typical cutoff marks or percentile, mentioning that it varies yearly."),
    admissionProcess: z.string().describe("A summary of the admission process after clearing the exam (e.g., counseling, interviews)."),
});

export type ExamDetails = z.infer<typeof ExamDetailsSchema>;

const GetExamDetailsInputSchema = z.object({
    examName: z.string().describe("The name of the exam to get details for (e.g., 'JEE Main', 'NEET', 'CUET')."),
});

export async function getExamDetails(input: z.infer<typeof GetExamDetailsInputSchema>): Promise<ExamDetails> {
    return getExamDetailsFlow(input);
}

const prompt = ai.definePrompt({
    name: 'getExamDetailsPrompt',
    input: { schema: GetExamDetailsInputSchema },
    output: { schema: ExamDetailsSchema },
    prompt: `You are an expert on Indian competitive exams. Provide concise details for the following exam: {{{examName}}}.
    
    - For the syllabus, briefly list the core subjects.
    - For the cutoff, give a general idea of the score/percentile range and mention that it changes each year.
    - For the admission process, briefly describe the steps after the exam.
    
    Keep all descriptions brief and to the point.`,
});

const getExamDetailsFlow = ai.defineFlow(
    {
        name: 'getExamDetailsFlow',
        inputSchema: GetExamDetailsInputSchema,
        outputSchema: ExamDetailsSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
