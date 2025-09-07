
'use server';
/**
 * @fileOverview A dynamic quiz generation AI agent.
 *
 * - getQuizQuestion - A function that generates a quiz question.
 * - QuizQuestionInput - The input type for the getQuizQuestion function.
 * - QuizQuestion - The return type for the getQuizQuestion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { v4 as uuidv4 } from 'uuid';
import type { Grade } from './personalized-stream-recommendation-from-quiz';

// Schemas for the questions
const BaseQuestionSchema = z.object({
  id: z.string().describe("A unique identifier for the question."),
  question: z.string().describe("The question text presented to the user."),
});

const SingleChoiceQuestionSchema = BaseQuestionSchema.extend({
  type: z.enum(['single-choice']),
  options: z.array(z.object({
    id: z.string(),
    value: z.string().describe("The text for the option."),
  })).describe('A list of possible answers for a single-choice question.'),
});

const MultipleChoiceQuestionSchema = BaseQuestionSchema.extend({
  type: z.enum(['multiple-choice']),
  options: z.array(z.object({
    id: z.string(),
    value: z.string().describe("The text for the option."),
  })).describe('A list of possible answers for a multiple-choice question.'),
});


const QuizQuestionOutputSchema = z.discriminatedUnion('type', [
  SingleChoiceQuestionSchema,
  MultipleChoiceQuestionSchema,
]);

export type QuizQuestion = z.infer<typeof QuizQuestionOutputSchema>;

const QuizQuestionInputSchema = z.object({
  grade: z.enum(['10th', '12th']),
  stream: z.string().optional().describe('The student\'s stream if they are in 12th grade (e.g., Science, Commerce, Arts).'),
  history: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })).optional().describe('The history of questions and answers from the current quiz session.'),
});

export type QuizQuestionInput = z.infer<typeof QuizQuestionInputSchema>;

export async function getQuizQuestion(input: QuizQuestionInput): Promise<QuizQuestion> {
  const question = await getQuizQuestionFlow(input);
  return question;
}

const prompt = ai.definePrompt({
  name: 'getQuizQuestionPrompt',
  input: { schema: QuizQuestionInputSchema },
  output: { schema: QuizQuestionOutputSchema },
  prompt: `You are a career counseling expert designing an adaptive quiz for students in India to recommend a career path.

The student is in grade: {{{grade}}}.
{{#if stream}}
The student's stream is: {{{stream}}}.
The goal is to recommend specific degree courses and career paths after 12th grade, based on their chosen stream: {{{stream}}}. The questions should be more focused on their stream-specific interests and skills.
{{else}}
The goal is to recommend a stream (Science, Commerce, Arts, Vocational) for 11th/12th grade. The questions should be broad to assess foundational interests and aptitudes.
{{/if}}

Generate the NEXT quiz question based on this context and the conversation history. The quiz should have a good mix of question types (single-choice, multiple-choice).
- The quiz will be around 5-7 questions long.
- Use the provided history of previous answers to make the next question more relevant and insightful.
- Vary the question format. Sometimes ask about preferences, sometimes about problem-solving styles, sometimes about ideal work environments.
- Questions should be designed to uncover the student's underlying interests, personality, and aptitudes, mapping to frameworks like RIASEC (Realistic, Investigative, Artistic, Social, Enterprising, Conventional) without mentioning the framework directly.

Conversation History:
{{#if history}}
{{#each history}}
  Q: {{question}}
  A: {{answer}}
{{/each}}
{{else}}
  This is the first question. Start with a broad question to understand the user's general inclination, keeping their grade level in mind.
{{/if}}

Based on the context and history, generate the next question.
- Provide 4 diverse options for each question.
- Ensure all option values and IDs are unique.
- Create a mix of single-choice and multiple-choice questions.
`,
});

const getQuizQuestionFlow = ai.defineFlow(
  {
    name: 'getQuizQuestionFlow',
    inputSchema: QuizQuestionInputSchema,
    outputSchema: QuizQuestionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    
    if (!output) {
      throw new Error("Failed to generate quiz question.");
    }
    
    // Add unique IDs to the output
    output.id = uuidv4();
    if (output.options) {
      output.options.forEach(o => o.id = uuidv4());
    }
    
    return output;
  }
);
